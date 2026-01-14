<template>
  <div class="flex items-start gap-3 relative z-10">
    <img
      class="w-10 h-10 rounded-full shrink-0 bg-cover bg-center border border-primary/30 shadow-sm"
      src="../../assets/logo2.png"
      alt="chatbot typing"
    />

    <div
      class="bg-gradient-to-br from-primary-light to-primary-light border border-primary/20 text-gray-800 rounded-2xl px-4 py-3 shadow flex gap-1"
    >
      <span class="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
      <span
        class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"
      ></span>
      <span
        class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"
      ></span>
    </div>
  </div>
</template>
