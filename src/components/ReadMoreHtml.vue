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
import { ref, onMounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    const maxPixels = parseInt(props.maxHeight, 10);
    if (!isNaN(maxPixels) && contentRef.value.scrollHeight > maxPixels + 10) {
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
.line-clamp-custom {
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-none {
  display: block;
}
</style>
