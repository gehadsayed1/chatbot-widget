<template>
  <div>
    <!-- زرار فتح/قفل -->
    <button 
      @click="open = !open" 
      class="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center">
      💬
    </button>

    <!-- البوكس -->
    <div 
      v-if="open"
      class="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col">
      
      <!-- الهيدر -->
      <div class="bg-blue-500 text-white p-3 rounded-t-xl flex justify-between items-center">
        <span>AI ChatBot</span>
        <button @click="open = false">✖</button>
      </div>

      <!-- الرسائل -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div v-for="(m, i) in messages" :key="i" :class="m.from">
          <div :class="m.from === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'" class="p-2 rounded-lg inline-block">
            {{ m.text }}
          </div>
        </div>
      </div>

      <!-- الإنبت -->
      <div class="p-2 border-t flex items-center gap-2">
        <input v-model="msg" placeholder="اكتب رسالة..." class="flex-1 border rounded px-2 py-1" />
        <button @click="send" class="bg-blue-500 text-white px-3 py-1 rounded">إرسال</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);
const msg = ref("");
const messages = ref([
  { text: "مرحباً 👋", from: "bot" }
]);

function send() {
  if (!msg.value) return;
  messages.value.push({ text: msg.value, from: "user" });

  // رد ثابت كديمو
  setTimeout(() => {
    messages.value.push({ text: "أنا بوت تجريبي 😎", from: "bot" });
  }, 500);

  msg.value = "";
}
</script>

<style scoped>
.user { text-align: right; }
.bot { text-align: left; }
</style>
