<template>
  <div class="bg-white rounded-lg p-0 shadow-sm border border-primary/20 mt-2 w-full overflow-hidden">
    <div class="bg-primary/5 p-3 border-b border-primary/10 flex items-center justify-between">
      <span class="text-sm font-bold text-primary-dark">
        {{ t('complaintForm.resultTitle') }}
      </span>
      <span class="text-xs bg-white px-2 py-0.5 rounded border border-primary/20 text-gray-600">
        {{ data.date }}
      </span>
    </div>

    <div class="p-4 text-sm space-y-3">
      <div v-if="data.branch && data.branch !== '-'" class="flex justify-between items-center border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('complaintForm.fields.branch') }}</span>
        <span class="text-xs text-gray-500">{{ data.branch }}</span>
      </div>

      <div v-if="data.depName" class="flex flex-col gap-0.5 border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('complaintForm.fields.depName') }}</span>
        <span class="text-xs text-primary-dark font-medium">{{ data.depName }}</span>
      </div>

      <div v-if="data.depCurrentState" class="flex flex-col gap-0.5 border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('complaintForm.fields.status') }}</span>
        <span class="text-xs text-gray-600 font-medium">{{ data.depCurrentState }}</span>
      </div>

       <div v-if="data.question" class="flex flex-col gap-0.5 border-b border-gray-50 pb-2">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('complaintForm.fields.details') }}</span>
        <span class="text-xs text-gray-600 leading-relaxed">{{ data.question }}</span>
      </div>
      
       <div v-if="data.inqType" class="flex justify-between items-center pt-1">
        <span class="text-gray-700 text-sm font-extrabold">{{ t('complaintForm.fields.type') }}</span>
        <span class="px-2 py-0.5 bg-primary/10 text-primary-dark text-[10px] font-bold rounded-full border border-primary/20 shadow-sm">
          {{ data.inqType }}
        </span>
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
