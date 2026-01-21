<template>
  <div class="bg-[#FFF8E1] rounded-3xl p-2 mt-2 w-full max-w-[270px] mx-auto">
    <div class="text-center font-bold text-[#4A4A4A] mb-5 text-[15px]">
      {{ t('inquiryForm.instruction') }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input
        v-model="mobile"
        type="tel"
        required
        class="w-full px-4 py-3 text-sm bg-transparent border border-[#d2961e]/40 rounded-2xl focus:outline-none focus:border-[#d2961e] focus:bg-white transition-all text-right placeholder-[#9CA3AF] text-gray-700"
        :placeholder="t('inquiryForm.mobile')"
      />

      <input
        v-model="complaintID"
        type="text"
        required
        class="w-full px-4 py-3 text-sm bg-transparent border border-[#d2961e]/40 rounded-2xl focus:outline-none focus:border-[#d2961e] focus:bg-white transition-all text-right placeholder-[#9CA3AF] text-gray-700"
        :placeholder="t('inquiryForm.complaintID')"
      />

      <button
        type="submit"
        :disabled="chat.isLoading || !mobile || !complaintID"
        class="w-full bg-[#d2961e] text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#b5893d] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        <span v-if="chat.isLoading">
            <i class="fa-solid fa-spinner fa-spin"></i>
        </span>
        <span v-else>{{ t('inquiryForm.submit') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useChatStore } from "../../stores/chat";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const chat = useChatStore();

const mobile = ref("");
const complaintID = ref("");

const handleSubmit = () => {
  console.log("Chat Store Actions:", chat);
  if (!mobile.value || !complaintID.value) return;
  chat.retrieveComplaint(complaintID.value, mobile.value);
};
</script>
