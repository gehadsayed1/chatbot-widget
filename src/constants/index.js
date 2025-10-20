// Chat Configuration
export const CHAT_CONFIG = {
  BOT_RESPONSE_DELAY: 1500,
  SCROLL_BEHAVIOR: 'smooth',
  MAX_MESSAGE_LENGTH: 1000,
};

// Suggestion Items
export const SUGGESTIONS = [
  { text: "استفسار", icon: "fa-solid fa-question-circle" },
  { text: "شكوى", icon: "fa-solid fa-exclamation-triangle" },
  { text: "اقتراح", icon: "fa-solid fa-lightbulb" },
  { text: "اتصل بنا", icon: "fa-solid fa-phone" },
];

// Bot Responses
export const BOT_RESPONSES = {
  WELCOME: "مرحباً بك! كيف يمكنني مساعدتك؟",
  AUTO_REPLY: "شكراً لتواصلك معنا، سيتم الرد عليك في أقرب وقت ممكن ⏰",
};

// Colors
export const THEME_COLORS = {
  PRIMARY: '#d2961e',
  SECONDARY: '#b07f14',
  DARK: '#8d680f',
};

// Organization static info (can be updated later)
export const ORG_INFO = {
  HOTLINE: '19591',
  PHONE: '22669703',
  ADDRESS: 'جمهورية مصر العربية، القاهرة — الهيئة العامة للرقابة على الصادرات والواردات',
  MAP_QUERY: 'الهيئة العامة للرقابة على الصادرات والواردات, القاهرة',
  HEAD: {
    NAME: 'اللواء المهندس أ.ح. عصام النجار',
    TITLE: 'رئيس الهيئة العامة للرقابة على الصادرات والواردات',
    IMAGE: 'https://www.goeic.gov.eg/front-assets/img/minster.png',
    CV_URL: 'https://www.goeic.gov.eg/ar/view_pdf?filePath=https%3A%2F%2Fwww.goeic.gov.eg%2Fupload%2Fonline%2F2024%2F03%2Fdocuments%2Ffiles%2Far%2F1528.pdf',
    // ضعِ نسخة ال PDF هنا: public/cv/goeic-head-cv.pdf
    CV_PATH: '1528.pdf',
    BIO_SHORT: '(مواليد 1965)، بكالوريوس العلوم العسكرية 1987، وبكالوريوس هندسة القاهرة 1995، وماجستير علوم عسكرية وزميل كلية الحرب العليا، وشغل منصب ملحق الدفاع المصري في تونس.'
  },
};

