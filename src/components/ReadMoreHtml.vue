<template>
  <div class="read-more-html-container relative">
    <div
      ref="contentRef"
      class="content-wrapper transition-all duration-300 ease-in-out relative overflow-hidden"
      :class="{ 'expanded': expanded }"
      :style="{ maxHeight: expanded ? 'none' : maxHeight }"
    >
      <div ref="slotContent">
        <slot></slot>
      </div>
      

    </div>

    <button
      v-if="showButton"
      @click="toggle"
      class="mt-2 text-primary-dark text-sm font-semibold hover:underline focus:outline-none flex items-center gap-1"
    >
      <span>{{ expanded ? 'إخفاء' : 'عرض المزيد' }}</span>
      <i :class="expanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({

  maxHeight: {
    type: String,
    default: '350px'
  }
});

const expanded = ref(false);
const showButton = ref(false);
const contentRef = ref(null);

const checkHeight = async () => {
  await nextTick();
  if (contentRef.value) {
    // Parse the pixel value from maxHeight (e.g., '120px' -> 120)
    const maxPixels = parseInt(props.maxHeight, 10);
    if (!isNaN(maxPixels) && contentRef.value.scrollHeight > maxPixels + 10) { // +10 buffer
      showButton.value = true;
    } else {
      showButton.value = false;
    }
  }
};

const toggle = () => {
  expanded.value = !expanded.value;
};

onMounted(() => {
  checkHeight();
});


</script>

<style scoped>

</style>
