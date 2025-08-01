// ملف خدمة API - للتواصل مع الباكند
// يحتوي على جميع الطلبات HTTP المطلوبة للتطبيق

import axios from 'axios';

// عنوان الباكند - يمكن تغييره حسب البيئة
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:54112';

// إعداد axios مع إعدادات افتراضية
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // مهلة زمنية 10 ثوان
  headers: {
    'Content-Type': 'application/json',
  }
});

// معالج الاستجابة - لمعالجة الأخطاء بشكل موحد
api.interceptors.response.use(
  (response) => response.data, // إرجاع البيانات مباشرة
  (error) => {
    console.error('خطأ في API:', error);
    
    // رسائل خطأ مخصصة حسب نوع الخطأ
    if (error.code === 'ECONNABORTED') {
      throw new Error('انتهت المهلة الزمنية للطلب');
    } else if (error.response?.status === 404) {
      throw new Error('البيانات المطلوبة غير موجودة');
    } else if (error.response?.status >= 500) {
      throw new Error('خطأ في الخادم، يرجى المحاولة لاحقاً');
    } else if (!error.response) {
      throw new Error('تأكد من اتصالك بالإنترنت');
    }
    
    throw error;
  }
);

// ===============================
// وظائف API
// ===============================

export const apiService = {
  // 1. جلب جميع الفصول
  async getChapters() {
    try {
      const response = await api.get('/api/chapters');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الفصول:', error);
      throw error;
    }
  },

  // 2. جلب جميع الدروس
  async getLessons() {
    try {
      const response = await api.get('/api/lessons');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الدروس:', error);
      throw error;
    }
  },

  // 3. جلب درس محدد
  async getLesson(lessonId) {
    try {
      if (!lessonId) {
        throw new Error('معرف الدرس مطلوب');
      }
      
      const response = await api.get(`/api/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب الدرس ${lessonId}:`, error);
      throw error;
    }
  },

  // 4. جلب دروس فصل محدد
  async getChapterLessons(chapterId) {
    try {
      if (!chapterId) {
        throw new Error('معرف الفصل مطلوب');
      }
      
      const response = await api.get(`/api/chapters/${chapterId}/lessons`);
      return response.data;
    } catch (error) {
      console.error(`خطأ في جلب دروس الفصل ${chapterId}:`, error);
      throw error;
    }
  },

  // 5. البحث في الكلمات
  async searchWords(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('نص البحث مطلوب');
      }
      
      const response = await api.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('خطأ في البحث:', error);
      throw error;
    }
  },

  // 6. جلب إحصائيات التطبيق
  async getStats() {
    try {
      const response = await api.get('/api/stats');
      return response.data;
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      throw error;
    }
  },

  // 7. فحص حالة الخادم
  async checkServerHealth() {
    try {
      const response = await api.get('/');
      return { isOnline: true, message: response.message };
    } catch (error) {
      console.error('الخادم غير متصل:', error);
      return { isOnline: false, error: error.message };
    }
  }
};

// ===============================
// وظائف مساعدة
// ===============================

// وظيفة لحفظ البيانات في التخزين المحلي (Cache)
export const cacheService = {
  // حفظ البيانات
  set(key, data, expiryMinutes = 30) {
    try {
      const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
      const cacheData = {
        data,
        expiry: expiryTime
      };
      localStorage.setItem(`language_app_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('لا يمكن حفظ البيانات في التخزين المحلي:', error);
    }
  },

  // جلب البيانات
  get(key) {
    try {
      const cached = localStorage.getItem(`language_app_${key}`);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      // التحقق من انتهاء صلاحية البيانات
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(`language_app_${key}`);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('خطأ في قراءة البيانات المحفوظة:', error);
      return null;
    }
  },

  // حذف البيانات
  remove(key) {
    try {
      localStorage.removeItem(`language_app_${key}`);
    } catch (error) {
      console.warn('خطأ في حذف البيانات:', error);
    }
  },

  // حذف جميع البيانات المحفوظة
  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('language_app_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('خطأ في حذف البيانات:', error);
    }
  }
};

// تصدير API service كـ default
export default apiService;