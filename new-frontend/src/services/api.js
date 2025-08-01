// ===================================
// API Service - خدمة التواصل مع الخادم
// يحتوي على جميع الطلبات HTTP للتطبيق
// ===================================

import axios from 'axios';

// عنوان الخادم - يمكن تغييره حسب البيئة
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:54112';

// إعداد axios مع إعدادات افتراضية
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // مهلة زمنية 10 ثوان
  headers: {
    'Content-Type': 'application/json',
  }
});

// معالج الطلبات - لإضافة headers إضافية إذا لزم الأمر
api.interceptors.request.use(
  (config) => {
    // يمكن إضافة token المصادقة هنا لاحقاً
    // config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالج الاستجابات - لمعالجة الأخطاء بشكل موحد
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('خطأ في API:', error);
    
    // معالجة أخطاء الشبكة
    if (!error.response) {
      throw new Error('خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت.');
    }
    
    // معالجة أخطاء الخادم
    const message = error.response.data?.message || 'حدث خطأ غير متوقع';
    throw new Error(message);
  }
);

// ===================================
// Courses API - خدمات الكورسات
// ===================================

export const coursesAPI = {
  // جلب جميع الكورسات
  getAll: async () => {
    const response = await api.get('/api/courses');
    return response.data;
  },

  // جلب كورس محدد
  getById: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  // جلب دروس كورس محدد
  getLessons: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}/lessons`);
    return response.data;
  }
};

// ===================================
// Lessons API - خدمات الدروس
// ===================================

export const lessonsAPI = {
  // جلب درس محدد
  getById: async (lessonId) => {
    const response = await api.get(`/api/lessons/${lessonId}`);
    return response.data;
  }
};

// ===================================
// Paragraphs API - خدمات الفقرات
// ===================================

export const paragraphsAPI = {
  // جلب فقرة محددة
  getById: async (paragraphId) => {
    const response = await api.get(`/api/paragraphs/${paragraphId}`);
    return response.data;
  }
};

// ===================================
// Quiz API - خدمات الاختبارات
// ===================================

export const quizAPI = {
  // إرسال إجابات الاختبار
  submit: async (paragraphId, answers) => {
    const response = await api.post('/api/quiz/submit', {
      paragraphId,
      answers
    });
    return response.data;
  }
};

// ===================================
// Writing API - خدمات تمارين الكتابة
// ===================================

export const writingAPI = {
  // فحص إجابة تمرين الكتابة
  check: async (paragraphId, exerciseId, answer) => {
    const response = await api.post('/api/writing/check', {
      paragraphId,
      exerciseId,
      answer
    });
    return response.data;
  }
};

// ===================================
// Search API - خدمات البحث
// ===================================

export const searchAPI = {
  // البحث في المحتوى
  search: async (query) => {
    const response = await api.get('/api/search', {
      params: { q: query }
    });
    return response.data;
  }
};

// ===================================
// Statistics API - خدمات الإحصائيات
// ===================================

export const statsAPI = {
  // جلب الإحصائيات العامة
  getGeneral: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  }
};

// ===================================
// Text-to-Speech Service - خدمة النطق الصوتي
// ===================================

export const speechAPI = {
  // تشغيل النطق الصوتي
  speak: (text, language = 'en-US') => {
    return new Promise((resolve, reject) => {
      // التحقق من دعم المتصفح
      if (!('speechSynthesis' in window)) {
        reject(new Error('متصفحك لا يدعم ميزة النطق الصوتي'));
        return;
      }

      // إيقاف أي نطق حالي
      window.speechSynthesis.cancel();

      // إنشاء النطق
      const utterance = new SpeechSynthesisUtterance(text);
      
      // إعدادات النطق
      utterance.lang = language;
      utterance.rate = 0.8; // سرعة النطق
      utterance.pitch = 1; // نبرة الصوت
      utterance.volume = 1; // مستوى الصوت

      // معالجات الأحداث
      utterance.onstart = () => {
        console.log('بدأ النطق:', text);
      };

      utterance.onend = () => {
        console.log('انتهى النطق');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('خطأ في النطق:', event.error);
        reject(new Error(`خطأ في النطق: ${event.error}`));
      };

      // تشغيل النطق
      window.speechSynthesis.speak(utterance);
    });
  },

  // إيقاف النطق
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  // التحقق من حالة النطق
  isSpeaking: () => {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  },

  // الحصول على الأصوات المتاحة
  getVoices: () => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve([]);
        return;
      }

      let voices = window.speechSynthesis.getVoices();
      
      if (voices.length) {
        resolve(voices);
      } else {
        // في بعض المتصفحات، الأصوات تتحمل بشكل غير متزامن
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  },

  // نطق النص الإنجليزي
  speakEnglish: (text) => {
    return speechAPI.speak(text, 'en-US');
  },

  // نطق النص العربي
  speakArabic: (text) => {
    return speechAPI.speak(text, 'ar-SA');
  }
};

// ===================================
// Local Storage Service - خدمة التخزين المحلي
// ===================================

export const storageAPI = {
  // حفظ البيانات
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      return false;
    }
  },

  // جلب البيانات
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      return defaultValue;
    }
  },

  // حذف البيانات
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('خطأ في حذف البيانات:', error);
      return false;
    }
  },

  // مسح جميع البيانات
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('خطأ في مسح البيانات:', error);
      return false;
    }
  }
};

// ===================================
// Progress Tracking Service - خدمة تتبع التقدم
// ===================================

export const progressAPI = {
  // حفظ تقدم الدرس
  saveProgress: (lessonId, progress) => {
    const key = `lesson_progress_${lessonId}`;
    return storageAPI.set(key, {
      lessonId,
      progress,
      timestamp: Date.now()
    });
  },

  // جلب تقدم الدرس
  getProgress: (lessonId) => {
    const key = `lesson_progress_${lessonId}`;
    return storageAPI.get(key, { progress: 0 });
  },

  // حفظ نتائج الاختبار
  saveQuizResult: (paragraphId, result) => {
    const key = `quiz_result_${paragraphId}`;
    const history = storageAPI.get(key, []);
    history.push({
      ...result,
      timestamp: Date.now()
    });
    return storageAPI.set(key, history);
  },

  // جلب نتائج الاختبار
  getQuizResults: (paragraphId) => {
    const key = `quiz_result_${paragraphId}`;
    return storageAPI.get(key, []);
  },

  // حفظ نتائج تمارين الكتابة
  saveWritingResult: (exerciseId, result) => {
    const key = `writing_result_${exerciseId}`;
    const history = storageAPI.get(key, []);
    history.push({
      ...result,
      timestamp: Date.now()
    });
    return storageAPI.set(key, history);
  },

  // جلب نتائج تمارين الكتابة
  getWritingResults: (exerciseId) => {
    const key = `writing_result_${exerciseId}`;
    return storageAPI.get(key, []);
  }
};

// ===================================
// Utility Functions - وظائف مساعدة
// ===================================

export const utils = {
  // تنسيق التاريخ
  formatDate: (timestamp) => {
    return new Date(timestamp).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // حساب النسبة المئوية
  calculatePercentage: (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  },

  // تحديد درجة الأداء
  getGrade: (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'success' };
    if (percentage >= 80) return { grade: 'A', color: 'success' };
    if (percentage >= 70) return { grade: 'B', color: 'warning' };
    if (percentage >= 60) return { grade: 'C', color: 'warning' };
    if (percentage >= 50) return { grade: 'D', color: 'danger' };
    return { grade: 'F', color: 'danger' };
  },

  // تأخير التنفيذ
  delay: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // خلط المصفوفة عشوائياً
  shuffleArray: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// تصدير الخدمات الأساسية كخدمة واحدة
export default {
  courses: coursesAPI,
  lessons: lessonsAPI,
  paragraphs: paragraphsAPI,
  quiz: quizAPI,
  writing: writingAPI,
  search: searchAPI,
  stats: statsAPI,
  speech: speechAPI,
  storage: storageAPI,
  progress: progressAPI,
  utils
};