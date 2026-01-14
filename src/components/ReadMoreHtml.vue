<template>
  <div class="read-more-html-container">
    <div
      ref="contentRef"
      class="content-wrapper transition-all duration-300 ease-in-out"
      :class="{ 'line-clamp-none': expanded, 'line-clamp-custom': !expanded }"
    >
      <slot></slot>
  
    </div>

    <button
      v-if="showButton"
      @click="toggle"
      class="text-primary-dark text-sm cursor-pointer hover:underline focus:outline-none flex items-center gap-1 bg-transparent border-none shadow-none mt-1"
      style="background-color: transparent !important; box-shadow: none !important;"
    >
      <span>{{ expanded ? t('showLess') : t('showMore') }}</span>
      <i :class="expanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  maxHeight: {
    type: String,
    default: '350px' // Kept for prop compat, but relying on visual clamp now
  }
});

const expanded = ref(false);
const showButton = ref(false);
const contentRef = ref(null);
let observer = null;

const checkHeight = async () => {
  await nextTick();
  if (contentRef.value) {
    // Check if content is clamped (scroll height > client height)
    // We add a small buffer (e.g., 2px) to account for sub-pixel rounding differences
    if (contentRef.value.scrollHeight > contentRef.value.clientHeight + 2) {
      showButton.value = true;
    } else {
      // If expanded, we always show button if it WAS needed (to allow collapse)
      // But if we want to dynamic hide if text becomes short?
      // Usually keep it simple: if not expanded and fits, hide.
      // If expanded, scrollHeight == clientHeight usually.
      // So we might lose the button if we expand.
      // We need to know if it *would* overflow if collapsed.
      
      // Better approach for "Show Less":
      // If expanded is true, we assume button should be visible (to collapse).
      // If expanded is false, showButton depends on overflow.
      
      if (!expanded.value) {
        showButton.value = false;
      }
    }
  }
};

const toggle = () => {
  expanded.value = !expanded.value;
  // If we are collapsing, we might need to re-verify but usually button stays required
};

onMounted(() => {
  checkHeight();
  
  if (contentRef.value) {
    observer = new MutationObserver(() => {
      checkHeight();
    });
    observer.observe(contentRef.value, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.line-clamp-custom {
  display: -webkit-box;
  -webkit-line-clamp: 10;
  line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-none {
  display: block;
}
</style>
