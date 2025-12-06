<template>
  <div class="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col w-full h-full rounded-none" role="dialog"
    aria-label="مكالمة صوتية" aria-modal="true">

    <header class="flex items-center justify-center px-4 py-3 bg-[#b5893d] text-white">
      <img src="../assets/SmartGOEIC.gif" alt="Smart GOEIC" class="w-40 object-contain" />
    </header>

    <main class="flex flex-col items-center justify-center flex-grow p-6">
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-44 w-44 rounded-full bg-[#b5893d]/20 animate-ping"></span>
        <span
          class="absolute inline-flex h-56 w-56 rounded-full bg-[#b5893d]/10 animate-ping [animation-delay:200ms]"></span>
        <span
          class="absolute inline-flex h-64 w-64 rounded-full bg-[#b5893d]/5 animate-ping [animation-delay:400ms]"></span>

        <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-[#b5893d] shadow-lg wave">
          <img src="https://t3.ftcdn.net/jpg/01/27/80/10/240_F_127801046_ArruIMeKVplhBv4xDPPoqkXSZQBIWgKW.jpg"
            class="w-full h-full object-cover" alt="صورة المتصل" />
        </div>
      </div>
      <p class="mt-8 text-lg font-semibold text-gray-700">
        {{ isSpeaking ? " ...Speaking" : " ...Listening" }}
      </p>
    </main>

    <footer class="p-6 flex justify-center">
      <button @click="onClose"
        class="w-14 h-14 rounded-full flex items-center justify-center text-white bg-red-600 shadow-md hover:bg-red-700 transition"
        aria-label="إنهاء المكالمة" title="إنهاء المكالمة">
        <i class="fa-solid fa-xmark text-3xl"></i>
      </button>
    </footer>
  </div>
</template>
<script setup>
import { useChatStore } from '../stores/chat';
import { onBeforeUnmount, onMounted, ref } from 'vue';;


const chat = useChatStore();

const isRecording = ref(false);
const isSpeaking = ref(false);
const isClosing = ref(false);

let mediaRecorder = null;
let audioChunks = [];
let websocket = null;
let audioContext = null;
let analyser = null;
let silenceTimer = null;
let stream = null;

const WEBSOCKET_URL = "wss://r6suex81bgxkht-8888.proxy.runpod.net/api/ws/voice";
const SILENCE_DURATION = 1000;
const SOUND_THRESHOLD = 30;

function onClose() {
  isClosing.value = true;
  stopRecording();
  if (silenceTimer) clearTimeout(silenceTimer);
  if (websocket) websocket.close();
  chat.closeVoiceCall();
}

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((audioStream) => {
      stream = audioStream;

      if (!audioContext) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioContext = new AC();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 512;

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      isRecording.value = true;
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = sendAudioData;

      detectSilence();
    })
    .catch((err) => {
      console.error("Mic error:", err);
    });
}

function detectSilence() {
  if (!analyser || !isRecording.value) return;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const checkAudio = () => {
    if (!isRecording.value) return;

    analyser.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    if (average > SOUND_THRESHOLD) {
      isSpeaking.value = true;
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    } else if (isSpeaking.value) {
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          isSpeaking.value = false;
          stopAndSendRecording();
        }, SILENCE_DURATION);
      }
    }

    requestAnimationFrame(checkAudio);
  };

  checkAudio();
}

function stopAndSendRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();

    setTimeout(() => {
      if (isRecording.value && !isClosing.value) {
        audioChunks = [];
        try {
          mediaRecorder.start();
        } catch (e) {
          setTimeout(() => {
            try {
              mediaRecorder.start();
            } catch (_) { }
          }, 150);
        }
      }
    }, 200);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  isRecording.value = false;
  isSpeaking.value = false;
  mediaRecorder = null;
  stream = null;
  analyser = null;
  audioChunks = [];

  if (audioContext && audioContext.state !== "closed") {
    audioContext
      .close()
      .then(() => {
        audioContext = null;
      })
      .catch(() => {
        audioContext = null;
      });
  }
}

function sendAudioData() {
  if (isClosing.value) return;

  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

  if (audioBlob.size < 500) {
    return;
  }

  connectWebSocket(audioBlob);
}

function connectWebSocket(audioBlob) {
  if (websocket && websocket.readyState !== WebSocket.CLOSED) {
    try {
      websocket.close();
    } catch (_) { }
  }

  websocket = new WebSocket(WEBSOCKET_URL);

  websocket.onopen = () => {
    websocket.send(audioBlob);
  };

  websocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      console.log("📨 Received message type:", data.type);
      
      if (data.type === "transcription") {
        console.log("📝 Transcription:", data.text);
      }
      
      if (data.type === "text_response") {
        console.log("💬 Text response:", data.answer);
        if (data.answer) {
          chat.messages.push({
            from: "bot",
            text: data.answer,
            timestamp: Date.now(),
          });
        }
      }
      
      if (data.type === "audio_response") {
        console.log("🔊 Audio response received, size:", data.audio?.length);
        if (data.audio) {
          playAudio(data.audio);
        }
      }
      
      if (data.error) {
        console.error("❌ Server error:", data.error);
      }
    } catch (err) {
      console.error("❌ Failed to parse message:", err, "Raw:", event.data.substring(0, 100));
    }
  };

  websocket.onerror = (err) => {
    console.error("WS Error:", err);
  };
}

function playAudio(b64) {
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }

  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  console.log("Playing audio - Blob size:", bytes.length, "Type:", blob.type);

  audio.play()
    .then(() => console.log("✅ Audio playing"))
    .catch((err) => console.error("❌ Play error:", err));

  audio.onended = () => {
    console.log("✅ Audio ended");
    URL.revokeObjectURL(url);
  };

  audio.onerror = (err) => {
    console.error("❌ Audio error:", err);
    URL.revokeObjectURL(url);
  };
}

onMounted(() => {
  isClosing.value = false;
  startRecording();
});

onBeforeUnmount(() => {
  isClosing.value = true;
  if (silenceTimer) clearTimeout(silenceTimer);
  if (websocket) websocket.close();
  stopRecording();
});
</script>

<style scoped>
@keyframes wave {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.06);
  }
}

.wave {
  animation: wave 2s infinite ease-in-out;
}
</style>
