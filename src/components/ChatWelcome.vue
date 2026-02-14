<template>
  <main class="flex-1 overflow-y-auto p-6 flex items-start justify-center">
    <div class="flex flex-col items-center text-center max-w-md">

      <img src="../assets/logo2.png" class="w-20 h-20 rounded-full mb-4 shadow-lg border-2 border-primary/30" />


      <div class="bg-gradient-to-br from-primary-light to-[#f4e6c2] text-gray-900 px-12 py-6 rounded-3xl shadow-xl border border-primary/20 leading-relaxed mb-6">
        <p class="font-bold text-xl mb-3 text-primary-dark">
          {{ t('welcomeTitle') }}
        </p>
        <p class="mb-4 text-sm opacity-90">
          {{ t('ministryName') }} <br />
          {{ t('authorityName') }}
        </p>
        <p class="font-medium">{{ t('welcomeMessage') }}</p>
      </div>

      <div class="w-full space-y-3" v-if="!chat.languageSelected">
        <p class="text-gray-500 text-sm font-semibold mb-2">{{ t('chooseLanguage') }}</p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button 
            @click="chat.setLanguage('ar')"
            class="flex-1 py-3 px-6 min-w-[100px] cursor-pointer rounded-2xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary-light hover:text-primary-dark transition-all duration-300 shadow-md transform hover:scale-[1.05]"
          >
            العربية
          </button>
          <button 
            @click="chat.setLanguage('en')"
            class="flex-1 py-3 px-6 min-w-[100px] cursor-pointer rounded-2xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary-light hover:text-primary-dark transition-all duration-300 shadow-md transform hover:scale-[1.05]"
          >
            English
          </button>
          <button 
            @click="chat.setLanguage('fr')"
            class="flex-1 py-3 px-6 min-w-[100px] cursor-pointer rounded-2xl bg-white border-2 border-primary text-primary font-bold hover:bg-primary-light hover:text-primary-dark transition-all duration-300 shadow-md transform hover:scale-[1.05]"
          >
            Français
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useChatStore } from '../stores/chat';
import { useI18n } from 'vue-i18n';
const chat = useChatStore();
const { t } = useI18n();
</script>
