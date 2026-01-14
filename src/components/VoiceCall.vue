<template>
  <div class="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col w-full h-full rounded-none" role="dialog"
    :aria-label="t('voiceStart')" aria-modal="true">

    <header class="flex items-center justify-center px-4 py-3 bg-primary-dark text-white">
      <img src="../assets/SmartGOEIC.gif" alt="Smart GOEIC" class="w-40 object-contain" />
    </header>

    <main class="flex flex-col items-center justify-center flex-grow p-6">
      <div class="relative flex items-center justify-center">
        <!-- Visualizer Bars (Behind the image or around it) -->
        <div class="absolute inset-0 flex items-center justify-center gap-1.5 z-0 pointer-events-none">
          <div v-for="(level, i) in visualizerBars" :key="i"
            class="w-3 bg-primary-dark rounded-full transition-[height] duration-75 ease-linear opacity-80"
            :style="{ height: `${Math.max(15, level * 1.5)}px` }">
          </div>
        </div>

        <div class="w-36 h-36 rounded-full overflow-hidden border-4 border-primary-dark shadow-lg relative z-10 bg-white transition-all duration-300"
             :class="{ 'wave shadow-glow': isSpeaking }">
          <img src="https://t3.ftcdn.net/jpg/01/27/80/10/240_F_127801046_ArruIMeKVplhBv4xDPPoqkXSZQBIWgKW.jpg"
            class="w-full h-full object-cover" alt="صورة المتصل" />
        </div>
      </div>
      <p class="mt-8 text-lg font-semibold text-gray-700">
        {{
          isProcessing ? t('voiceProcessing') :
          isSpeaking ? t('voiceSpeaking') :
          t('voiceListening')
        }}
      </p>
    </main>

    <footer class="p-6 flex justify-center gap-8">
      <button @click="onClose"
        class="w-14 h-14 rounded-full flex items-center justify-center text-white bg-red-600 shadow-md hover:bg-red-700 transition"
        :aria-label="t('voiceError')" :title="t('voiceError')">
        <i class="fa-solid fa-xmark text-3xl"></i>
      </button>

      <button @click="toggleRecording"
        class="w-14 h-14 rounded-full cursor-pointer flex items-center justify-center text-white shadow-md transition"
        :class="isRecording ? 'bg-primary-dark hover:bg-primary-hover/80' : 'bg-primary-dark hover:bg-primary-hover'"
        :title="isRecording ? t('sendButton') : t('voiceStart')">
        <i :class="isRecording ? 'fa-solid fa-paper-plane text-2xl' : 'fa-solid fa-microphone text-2xl'"></i>
      </button>
    </footer>
  </div>
</template>
<script setup>
import { useChatStore } from '../stores/chat';
import { useI18n } from 'vue-i18n';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const chat = useChatStore();
const { t } = useI18n();

const isRecording = ref(false);
const isSpeaking = ref(false);
const isProcessing = ref(false);
const isClosing = ref(false);

const visualizerBars = ref([20, 20, 20, 20, 20]); // 5 bars

let mediaRecorder = null;
let audioChunks = [];
let audioContext = null;
let analyser = null;
let silenceTimer = null;
let stream = null;


const SILENCE_DURATION = 1000;
const SOUND_THRESHOLD = 30;

function onClose() {
  isClosing.value = true;
  stopRecording();
  if (silenceTimer) clearTimeout(silenceTimer);
  chat.closeVoiceCall();
}

function toggleRecording() {
    if (isRecording.value) {
        stopAndSendRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
  stopPlayback(); // Stop bot audio if playing
  
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

// ... (inside checkAudio)
  const checkAudio = () => {
    if ((!isRecording.value && !isSpeaking.value) || !analyser) {
        // Reset bars if not active
        visualizerBars.value = [20, 20, 20, 20, 20];
        if(!isRecording.value) return; 
    }

    if(analyser) {
        analyser.getByteFrequencyData(dataArray);

        // Pick 5 distinct frequencies (low to mid)
        // Adjust indices to capture voice range better (e.g. 0 to 50)
        const newBars = [];
        const step = Math.floor(bufferLength / 10); // Check lower frequencies
        
        for (let i = 0; i < 5; i++) {
            const index = i * step + 2; 
            let val = dataArray[index] || 0;
            // Amplify for visual effect
            if (isSpeaking.value) { // Use 'isSpeaking' or just raw input?
                // User input visualization
                // If isSpeaking is false (bot speaking?), we might want to visualize bot audio too if we could connect it to analyser, 
                // but currently analyser is connected to MIC stream.
                // So this only visualizes User input.
             }
             
             newBars.push(val);
        }
        visualizerBars.value = newBars;
        
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

        if (average > SOUND_THRESHOLD) {
             isSpeaking.value = true;
             // We don't need to stop playback here because we stop it on startRecording
        } else {
             isSpeaking.value = false;
        }
    }

    requestAnimationFrame(checkAudio);
  };

  checkAudio();
}

function stopAndSendRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop(); 
    // Do NOT restart recording here. Wait for user to click Start again.
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

  isRecording.value = false; // Ensure visual state is off
  
  if (audioBlob.size < 500) {
    return;
  }

  isProcessing.value = true; // Start processing state
  processVoice(audioBlob);
}

async function processVoice(audioBlob) {
  try {
    const data = await chat.sendVoiceMessage(audioBlob);
    if (data && data.audio) {
      playAudio(data.audio);
    } else {
      isProcessing.value = false;
    }
  } catch (error) {
    console.error("Error processing voice:", error);
    isProcessing.value = false;
  }
}

let currentAudio = null;

function stopPlayback() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function playAudio(b64) {
  // Stop previous audio before playing new one
  stopPlayback();

  const audioSrc = `data:audio/mp3;base64,${b64}`;
  const audio = new Audio(audioSrc);
  
  currentAudio = audio;
  isProcessing.value = false; // Stop processing state when audio starts

  audio.play()
    .then(() => {
      console.log("✅ Audio playing");
    })
    .catch((err) => console.error("❌ Play error:", err));

  audio.onended = () => {
    console.log("✅ Audio ended");
    currentAudio = null;
  };

  audio.onerror = (err) => {
    console.error("❌ Audio error:", err);
    currentAudio = null;
  };
}

onMounted(() => {
  isClosing.value = false;
  // startRecording(); // Disabled auto-start
});

onBeforeUnmount(() => {
  isClosing.value = true;
  stopPlayback();
  if (silenceTimer) clearTimeout(silenceTimer);
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

.shadow-glow {
  box-shadow: 0 0 15px 5px rgba(210, 150, 30, 0.6);
}
</style>
