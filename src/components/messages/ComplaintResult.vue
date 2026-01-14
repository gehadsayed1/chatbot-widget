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

    <div class="p-3 text-sm space-y-2">
      <div v-if="data.branch && data.branch !== '-'" class="flex justify-between border-b border-gray-50 pb-2">
        <span class="text-gray-500 text-xs">{{ t('complaintForm.fields.branch') }}</span>
        <span class="font-medium">{{ data.branch }}</span>
      </div>

      <div v-if="data.depName" class="flex flex-col gap-1 border-b border-gray-50 pb-2">
        <span class="text-gray-500 text-xs">{{ t('complaintForm.fields.depName') }}</span>
        <span class="font-medium text-primary-dark">{{ data.depName }}</span>
      </div>

      <div v-if="data.depCurrentState" class="flex flex-col gap-1 border-b border-gray-50 pb-2">
        <span class="text-gray-500 text-xs">{{ t('complaintForm.fields.status') }}</span>
        <span class="font-medium">{{ data.depCurrentState }}</span>
      </div>

       <div v-if="data.question" class="flex flex-col gap-1 border-b border-gray-50 pb-2">
        <span class="text-gray-500 text-xs">{{ t('complaintForm.fields.details') }}</span>
        <span class="font-medium text-gray-700 leading-relaxed">{{ data.question }}</span>
      </div>
      
       <div v-if="data.inqType" class="flex justify-between pt-1">
        <span class="text-gray-500 text-xs">{{ t('complaintForm.fields.type') }}</span>
        <span class="font-medium">{{ data.inqType }}</span>
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
