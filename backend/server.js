// ملف السيرفر الرئيسي - Node.js + Express
// يوفر API endpoints لتطبيق تعليم اللغات

const express = require('express');
const cors = require('cors');
const lessonsData = require('./data.js');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 5000;

// إعداد Middleware
app.use(cors()); // للسماح بالطلبات من المتصفح (Cross-Origin)
app.use(express.json()); // لتحليل JSON في الطلبات

// ===============================
// API Endpoints (نقاط النهاية)
// ===============================

// 1. الصفحة الرئيسية للAPI
app.get('/', (req, res) => {
  res.json({
    message: "مرحبا بك في API تعليم اللغات! 🌐",
    version: "1.0.0",
    endpoints: {
      chapters: "/api/chapters - للحصول على جميع الفصول",
      lessons: "/api/lessons - للحصول على جميع الدروس",
      lesson: "/api/lessons/:id - للحصول على درس محدد",
      chapterLessons: "/api/chapters/:id/lessons - للحصول على دروس فصل محدد"
    }
  });
});

// 2. الحصول على جميع الفصول
app.get('/api/chapters', (req, res) => {
  try {
    // إرسال جميع الفصول مع معلومات إضافية
    const chaptersWithInfo = lessonsData.chapters.map(chapter => ({
      ...chapter,
      lessonsCount: chapter.lessons.length, // عدد الدروس في كل فصل
      totalWords: chapter.lessons.reduce((total, lessonId) => {
        const lesson = lessonsData.lessons.find(l => l.id === lessonId);
        return total + (lesson ? lesson.words.length : 0);
      }, 0) // عدد الكلمات الإجمالي في الفصل
    }));

    res.json({
      success: true,
      data: chaptersWithInfo,
      message: "تم جلب جميع الفصول بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الفصول",
      error: error.message
    });
  }
});

// 3. الحصول على جميع الدروس
app.get('/api/lessons', (req, res) => {
  try {
    res.json({
      success: true,
      data: lessonsData.lessons,
      count: lessonsData.lessons.length,
      message: "تم جلب جميع الدروس بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الدروس",
      error: error.message
    });
  }
});

// 4. الحصول على درس محدد بالـ ID
app.get('/api/lessons/:id', (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const lesson = lessonsData.lessons.find(l => l.id === lessonId);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "الدرس غير موجود"
      });
    }

    // إضافة معلومات إضافية عن الدرس
    const lessonWithInfo = {
      ...lesson,
      wordsCount: lesson.words.length,
      chapterInfo: lessonsData.chapters.find(c => c.id === lesson.chapterId)
    };

    res.json({
      success: true,
      data: lessonWithInfo,
      message: "تم جلب الدرس بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الدرس",
      error: error.message
    });
  }
});

// 5. الحصول على دروس فصل محدد
app.get('/api/chapters/:id/lessons', (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);
    const chapter = lessonsData.chapters.find(c => c.id === chapterId);
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "الفصل غير موجود"
      });
    }

    // جلب جميع دروس هذا الفصل
    const chapterLessons = lessonsData.lessons.filter(lesson => 
      chapter.lessons.includes(lesson.id)
    );

    res.json({
      success: true,
      data: {
        chapter: chapter,
        lessons: chapterLessons,
        lessonsCount: chapterLessons.length
      },
      message: `تم جلب دروس فصل "${chapter.title}" بنجاح`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب دروس الفصل",
      error: error.message
    });
  }
});

// 6. البحث في الكلمات
app.get('/api/search', (req, res) => {
  try {
    const searchTerm = req.query.q; // معامل البحث من URL
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "يرجى إدخال كلمة للبحث"
      });
    }

    // البحث في جميع الكلمات
    const searchResults = [];
    lessonsData.lessons.forEach(lesson => {
      lesson.words.forEach(word => {
        if (
          word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.arabic.includes(searchTerm) ||
          word.example_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.example_ar.includes(searchTerm)
        ) {
          searchResults.push({
            ...word,
            lessonInfo: {
              id: lesson.id,
              title: lesson.title,
              title_en: lesson.title_en
            }
          });
        }
      });
    });

    res.json({
      success: true,
      data: searchResults,
      count: searchResults.length,
      searchTerm: searchTerm,
      message: `تم العثور على ${searchResults.length} نتيجة`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في البحث",
      error: error.message
    });
  }
});

// 7. إحصائيات المحتوى
app.get('/api/stats', (req, res) => {
  try {
    const totalChapters = lessonsData.chapters.length;
    const totalLessons = lessonsData.lessons.length;
    const totalWords = lessonsData.lessons.reduce((total, lesson) => 
      total + lesson.words.length, 0
    );

    res.json({
      success: true,
      data: {
        totalChapters,
        totalLessons,
        totalWords,
        averageWordsPerLesson: Math.round(totalWords / totalLessons)
      },
      message: "تم جلب الإحصائيات بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الإحصائيات",
      error: error.message
    });
  }
});

// ===============================
// معالجة الأخطاء
// ===============================

// معالجة الروابط غير الموجودة (404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "هذا الرابط غير موجود",
    requestedPath: req.originalUrl
  });
});

// معالجة الأخطاء العامة
app.use((error, req, res, next) => {
  console.error('خطأ في السيرفر:', error);
  res.status(500).json({
    success: false,
    message: "خطأ داخلي في السيرفر",
    error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي'
  });
});

// ===============================
// تشغيل السيرفر
// ===============================

app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
  console.log(`📚 API التوثيق: http://localhost:${PORT}/`);
  console.log(`🌐 جميع الفصول: http://localhost:${PORT}/api/chapters`);
  console.log(`📖 جميع الدروس: http://localhost:${PORT}/api/lessons`);
});

// تصدير التطبيق للاختبار
module.exports = app;