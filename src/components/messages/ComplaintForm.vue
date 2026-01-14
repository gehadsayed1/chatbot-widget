<template>
  <div class="bg-white rounded-lg p-2 shadow-sm border border-gray-100 mt-2 w-full max-w-md">
    <div class="text-sm font-bold text-primary mb-3 border-b pb-2">
      <i class="fa-solid fa-clipboard-question ml-2"></i>
      {{ t('complaintForm.title') }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-3 px-2">
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('complaintForm.taxNumber') }}
        </label>
        <input
          v-model="taxNum"
          type="text"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-right"
          placeholder="123456..."
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1">
          {{ t('complaintForm.complaintNumber') }}
        </label>
        <input
          v-model="complaintNum"
          type="text"
          required
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-right"
          placeholder="33..."
        />
      </div>

      <button
        type="submit"
        :disabled="loading || !taxNum || !complaintNum"
        class="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
        </span>
        <span v-else>{{ t('complaintForm.submit') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useChatStore } from "../../stores/chat";
import { useI18n } from "vue-i18n";

const props = defineProps({
  loading: Boolean
});

const { t } = useI18n();
const chat = useChatStore();

const taxNum = ref("");
const complaintNum = ref("");

const handleSubmit = () => {
  if (!taxNum.value || !complaintNum.value) return;
  chat.inquireComplaint(complaintNum.value, taxNum.value);
};
</script>
