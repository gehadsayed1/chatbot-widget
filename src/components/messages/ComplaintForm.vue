<template>
  <div class="bg-[#FFF8E1] rounded-3xl p-2   mt-2 w-full max-w-[270px] mx-auto">
    <div class="text-center font-bold text-[#4A4A4A] mb-5 text-[15px]">
      {{ t('complaintForm.instruction') }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input
        v-model="complaintNum"
        type="text"
        required
        class="w-full px-4 py-3 text-sm bg-transparent border border-[#d2961e]/40 rounded-2xl focus:outline-none focus:border-[#d2961e] focus:bg-white transition-all text-right placeholder-[#9CA3AF] text-gray-700"
        :placeholder="t('complaintForm.complaintNumber')"
      />

      <input
        v-model="taxNum"
        type="text"
        required
        class="w-full px-4 py-3 text-sm bg-transparent border border-[#d2961e]/40 rounded-2xl focus:outline-none focus:border-[#d2961e] focus:bg-white transition-all text-right placeholder-[#9CA3AF] text-gray-700"
        :placeholder="t('complaintForm.taxNumber')"
      />

      <button
        type="submit"
        :disabled="loading || !taxNum || !complaintNum"
        class="w-full bg-[#d2961e] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#b5893d] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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
