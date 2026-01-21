<template>
  <div class="bg-white rounded-2xl p-0 shadow-sm border border-primary/20 mt-2 w-full overflow-hidden">
    <div class="bg-primary/5 p-3 border-b border-primary/10 flex items-center justify-between">
      <span class="text-sm font-bold text-primary-dark">
        {{ t('inquiryForm.success') }}
      </span>
      <span v-if="data.date" class="text-xs bg-white px-2 py-0.5 rounded border border-primary/20 text-gray-600">
        {{ data.date }}
      </span>
    </div>

    <div class="p-4 text-sm space-y-3">
      <div v-if="data.complaintID" class="flex justify-between items-center border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('inquiryForm.fields.complaintID') }}</span>
        <span class="text-xs text-gray-500 font-bold">#{{ data.complaintID }}</span>
      </div>

      <div v-if="data.type" class="flex justify-between items-center border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('inquiryForm.fields.type') }}</span>
        <span class="px-2 py-0.5 bg-primary/10 text-primary-dark text-[10px] font-bold rounded-full border border-primary/20">
          {{ data.type }}
        </span>
      </div>

      <div v-if="data.title" class="flex flex-col gap-0.5 border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('inquiryForm.fields.title') }}</span>
        <span class="text-xs text-gray-600 font-medium">{{ data.title }}</span>
      </div>

       <div v-if="data.answer" class="flex flex-col gap-0.5 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('inquiryForm.fields.answer') }}</span>
        <span class="text-xs text-primary-dark leading-relaxed font-bold whitespace-pre-line">{{ data.answer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  data: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
</script>
