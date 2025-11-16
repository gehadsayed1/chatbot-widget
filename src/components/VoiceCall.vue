<template>
  <div
    class="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col w-full h-full rounded-none"
    role="dialog"
    aria-label="مكالمة صوتية"
    aria-modal="true"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-center px-4 py-3 bg-[#b5893d] text-white"
    >
      <img
        src="../assets/SmartGOEIC.gif"
        alt="Smart GOEIC"
        class="w-40 object-contain"
      />
    </header>

    <!-- Content -->
    <main class="flex flex-col items-center justify-center flex-grow p-6">
      <div class="relative flex items-center justify-center">
        <!-- Pulsing circles behind avatar -->
        <span
          class="absolute inline-flex h-44 w-44 rounded-full bg-[#b5893d]/20 animate-ping"
        ></span>
        <span
          class="absolute inline-flex h-56 w-56 rounded-full bg-[#b5893d]/10 animate-ping [animation-delay:200ms]"
        ></span>
        <span
          class="absolute inline-flex h-64 w-64 rounded-full bg-[#b5893d]/5 animate-ping [animation-delay:400ms]"
        ></span>

        <!-- Avatar with subtle wave -->
        <div
          class="w-36 h-36 rounded-full overflow-hidden border-4 border-[#b5893d] shadow-lg wave"
        >
          <img
            src="https://t3.ftcdn.net/jpg/01/27/80/10/240_F_127801046_ArruIMeKVplhBv4xDPPoqkXSZQBIWgKW.jpg"
            class="w-full h-full object-cover"
            alt="صورة المتصل"
          />
        </div>
      </div>
      <p class="mt-8 text-lg font-semibold text-gray-700">
        {{ isSpeaking ? " ...Speaking" : " ...Listening" }}
      </p>
    </main>

  
    <footer class="p-6 flex justify-center">
      <button
        @click="onClose"
        class="w-14 h-14 rounded-full flex items-center justify-center text-white bg-red-600 shadow-md hover:bg-red-700 transition"
        aria-label="إنهاء المكالمة"
        title="إنهاء المكالمة"
      >
        <i class="fa-solid fa-xmark text-3xl" aria-hidden="true"></i>
      </button>
    </footer>
  </div>
</template>
<script setup>
import { useChatStore } from "../stores/chat";
import { ref, onMounted, onBeforeUnmount } from "vue";

const chat = useChatStore();

const isRecording = ref(false);
const isSpeaking = ref(false);
const isClosing = ref(false); // علشان نعرف لو بنقفل
let mediaRecorder = null;
let audioChunks = [];
let websocket = null;
let audioContext = null;
let analyser = null;
let silenceTimer = null;
let stream = null;

const WEBSOCKET_URL = "wss://r6suex81bgxkht-8888.proxy.runpod.net/api/ws/voice";
const SILENCE_DURATION = 1000; // 1 second of silence
const SOUND_THRESHOLD = 30; // Threshold for detecting sound

function onClose() {
  isClosing.value = true; // نعلم إننا بنقفل
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

      // Setup analyser for voice activity detection
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

      // Start monitoring audio levels
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

    // Calculate average volume
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

    if (average > SOUND_THRESHOLD) {
      // User is speaking
      isSpeaking.value = true;

      // Clear any existing silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    } else if (isSpeaking.value) {
      // User stopped speaking, start silence timer
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          // 1 second of silence detected
          isSpeaking.value = false;
          stopAndSendRecording();
        }, SILENCE_DURATION);
      }
    }

    // Continue monitoring
    requestAnimationFrame(checkAudio);
  };

  checkAudio();
}

function stopAndSendRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    // Don't stop the stream, keep recording for next turn
    setTimeout(() => {
      if (isRecording.value && !isClosing.value) {
        audioChunks = [];
        mediaRecorder.start();
      }
    }, 100);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  // Reset all variables
  isRecording.value = false;
  isSpeaking.value = false;
  mediaRecorder = null;
  stream = null;
  analyser = null;
  audioChunks = [];

  // Close audio context
  if (audioContext && audioContext.state !== "closed") {
    audioContext
      .close()
      .then(() => {
        audioContext = null;
      })
      .catch((err) => {
        console.error("Error closing audio context:", err);
        audioContext = null;
      });
  }
}

function sendAudioData() {
  if (isClosing.value) {
    console.log("Closing, not sending audio.");
    return;
  }

  const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

  if (audioBlob.size < 500) {
    console.log("No audio recorded.");
    return;
  }

  connectWebSocket(audioBlob);
}

function connectWebSocket(audioBlob) {
  websocket = new WebSocket(WEBSOCKET_URL);

  websocket.onopen = () => {
    console.log("WS Connected");
    websocket.send(audioBlob);
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "full_response") {
      console.log("User said:", data.transcript);
      console.log("Bot said:", data.answer);
    }

    if (data.type === "audio_chunk") {
      playAudio(data.audio);
    }

    if (data.type === "stream_end") {
      console.log("Voice ended.");
      websocket.close();
    }
  };

  websocket.onerror = (err) => {
    console.error("WS Error:", err);
  };
}

function playAudio(b64) {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.play().catch((err) => console.error("Play error:", err));

  audio.onended = () => {
    URL.revokeObjectURL(url);
    console.log("Audio finished.");
  };
}

onMounted(() => {
  isClosing.value = false; // نتأكد إننا مش في وضع الإغلاق
  startRecording();
});

onBeforeUnmount(() => {
  isClosing.value = true; // نعلم إننا بنقفل
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
