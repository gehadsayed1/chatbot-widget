<template>
  <div class="flex justify-end items-start gap-3 relative z-10">
    <div
      role="article"
      class="message-bubble from-user bg-gradient-to-br from-primary to-primary-dark text-white border border-white/30 rounded-2xl px-4 py-3 shadow max-w-[80%] break-words whitespace-pre-line"
    >
      <ReadMoreHtml>
        {{ msg.text }}
      </ReadMoreHtml>
    </div>

    <img
      class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
      src="../../assets/user.webp"
      alt="صورة المستخدم"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
import ReadMoreHtml from "../ReadMoreHtml.vue";

defineProps({
  msg: {
    type: Object,
    required: true,
  },
});
</script>
