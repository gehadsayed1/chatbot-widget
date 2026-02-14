<template>
  <div :dir="direction" :lang="locale">
    <ChatBox />
    <ChatToggle />
  </div>
</template>

<script setup>
import { computed, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import ChatBox from './components/ChatBox.vue'
import ChatToggle from './components/ChatToggle.vue'

const { locale } = useI18n()

// Compute direction based on locale
const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

onMounted(() => {
  // Robustly inject FontAwesome into Shadow Root
  const instance = getCurrentInstance();
  const rootNode = instance?.vnode?.el?.getRootNode();
  
  if (rootNode instanceof ShadowRoot) {
    // Check if already injected
    if (!rootNode.querySelector('#fa-styles')) {
      const link = document.createElement('link');
      link.id = 'fa-styles';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      rootNode.appendChild(link);
    }
  }
})
</script>

<style>
/* :host targets the custom element itself (Shadow DOM root) */
:host {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  display: block;
  font-family: inherit;
  line-height: 1.5;
}

/* Explicit reset for Shadow DOM - Critical for borders */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}
</style>
