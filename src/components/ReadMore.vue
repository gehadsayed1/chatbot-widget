<template>
  <span>
    <span v-if="!expanded">{{ truncated }}</span>
    <span v-else>{{ text }}</span>
    <button
      v-if="isTruncated"
      class="ml-2 text-[#b07f14] underline"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'إخفاء' : 'عرض المزيد' }}
    </button>
  </span>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  maxChars: { type: Number, default: 220 },
})

const expanded = ref(false)
const isTruncated = computed(() => (props.text || '').length > props.maxChars)
const truncated = computed(() =>
  isTruncated.value ? (props.text || '').slice(0, props.maxChars) + '…' : props.text
)
</script>


