// ===================================
// Language Learning Platform - Backend Server
// Node.js + Express API Server
// ===================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 54112;

// ===================================
// Middleware Configuration
// إعداد الوسطاء
// ===================================

// CORS - للسماح بالطلبات من جميع النطاقات (للاختبار فقط)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// استخدام cors كوسيط إضافي
app.use(cors());

// Body Parser - لتحليل JSON في الطلبات
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// إعداد لحفظ ملفات الوسائط الثابتة
app.use('/static', express.static('public'));

// ===================================
// Data Loading Functions
// وظائف تحميل البيانات
// ===================================

// تحميل بيانات الدروس من ملف JSON
function loadLessonsData() {
  try {
    const dataPath = path.join(__dirname, 'data', 'rich-content.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    // تنظيم البيانات بالشكل المطلوب
    return {
      courses: parsedData.courses || [],
      lessons: parsedData.lessons || [],
      paragraphs: parsedData.paragraphs || [],
      keywords: parsedData.keywords || [],
      quizzes: parsedData.quizzes || [],
      exercises: parsedData.exercises || [],
      contact_info: parsedData.contact_info || {}
    };
  } catch (error) {
    console.error('خطأ في تحميل بيانات الدروس:', error);
    return { courses: [], lessons: [], paragraphs: [], keywords: [], quizzes: [], exercises: [] };
  }
}

// حفظ بيانات الدروس (للميزات المستقبلية)
function saveLessonsData(data) {
  try {
    const dataPath = path.join(__dirname, 'data', 'lessons.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    return false;
  }
}

// تحميل البيانات عند بدء التشغيل
let lessonsData = loadLessonsData();

// ===================================
// API Routes - المسارات
// ===================================

// الصفحة الرئيسية - توثيق API
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في منصة تعليم اللغات! 🌐',
    version: '1.0.0',
    endpoints: {
      'GET /api/courses': 'جلب جميع الكورسات',
      'GET /api/courses/:courseId': 'جلب كورس محدد',
      'GET /api/courses/:courseId/lessons': 'جلب دروس كورس',
      'GET /api/lessons/:lessonId': 'جلب درس محدد',
      'GET /api/paragraphs/:paragraphId': 'جلب فقرة محددة',
      'POST /api/quiz/submit': 'إرسال إجابات الاختبار',
      'POST /api/writing/check': 'فحص تمارين الكتابة',
      'GET /api/search': 'البحث في المحتوى'
    },
    documentation: 'http://localhost:' + PORT + '/api/docs'
  });
});

// ===================================
// Courses API - مسارات الكورسات
// ===================================

// جلب جميع الكورسات
app.get('/api/courses', (req, res) => {
  try {
    console.log('📚 طلب جلب الكورسات...');
    console.log('عدد الكورسات المتاحة:', lessonsData.courses ? lessonsData.courses.length : 0);
    
    if (!lessonsData.courses || lessonsData.courses.length === 0) {
      return res.json({
        success: true,
        data: [],
        total: 0,
        message: 'لا توجد كورسات متاحة حالياً'
      });
    }

    // إرجاع معلومات الكورسات مع عدد الدروس
    const courses = lessonsData.courses.map(course => {
      const courseLessons = lessonsData.lessons ? lessonsData.lessons.filter(l => l.course_id === course.id) : [];
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        lessons_count: course.lessons_count || courseLessons.length,
        image: course.image,
        color: course.color,
        instructor: course.instructor,
        rating: course.rating,
        students: course.students,
        price: course.price,
        category: course.category,
        skills: course.skills
      };
    });

    res.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الكورسات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكورسات',
      error: error.message
    });
  }
});

// جلب كورس محدد مع جميع تفاصيله
app.get('/api/courses/:courseId', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = lessonsData.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'الكورس غير موجود'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الكورس',
      error: error.message
    });
  }
});

// جلب دروس كورس محدد
app.get('/api/courses/:courseId/lessons', (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = lessonsData.courses.find(c => c.id === courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'الكورس غير موجود'
      });
    }

    // جلب الدروس من المصفوفة المنفصلة
    const courseLessons = lessonsData.lessons 
      ? lessonsData.lessons.filter(l => l.course_id === courseId)
      : [];

    // إرجاع الدروس مع معلومات أساسية
    const lessons = courseLessons.map(lesson => {
      // عد الفقرات المرتبطة بهذا الدرس
      const lessonParagraphs = lessonsData.paragraphs 
        ? lessonsData.paragraphs.filter(p => p.lesson_id === lesson.id)
        : [];
      
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        level: lesson.level,
        order: lesson.order,
        video_url: lesson.video_url,
        objectives: lesson.objectives,
        paragraphsCount: lessonParagraphs.length,
        courseId: courseId
      };
    });

    console.log(`📚 جلب ${lessons.length} دروس للكورس ${courseId}`);

    res.json({
      success: true,
      data: lessons.sort((a, b) => a.order - b.order),
      courseTitle: course.title,
      total: lessons.length
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الدروس:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الدروس',
      error: error.message
    });
  }
});

// ===================================
// Lessons API - مسارات الدروس
// ===================================

// جلب درس محدد مع جميع فقراته
app.get('/api/lessons/:lessonId', (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    
    // البحث عن الدرس في المصفوفة المنفصلة
    const foundLesson = lessonsData.lessons 
      ? lessonsData.lessons.find(l => l.id === lessonId)
      : null;

    if (!foundLesson) {
      return res.status(404).json({
        success: false,
        message: 'الدرس غير موجود'
      });
    }

    // البحث عن الكورس المرتبط
    const relatedCourse = lessonsData.courses 
      ? lessonsData.courses.find(c => c.id === foundLesson.course_id)
      : null;

    // جلب الفقرات المرتبطة بهذا الدرس
    const lessonParagraphs = lessonsData.paragraphs 
      ? lessonsData.paragraphs.filter(p => p.lesson_id === lessonId)
      : [];

    // إثراء كل فقرة بالاختبارات والتمارين
    const enrichedParagraphs = lessonParagraphs.map(paragraph => {
      const paragraphQuizzes = lessonsData.quizzes 
        ? lessonsData.quizzes.filter(q => q.paragraph_id === paragraph.id)
        : [];
      
      const paragraphExercises = lessonsData.exercises 
        ? lessonsData.exercises.filter(e => e.paragraph_id === paragraph.id)
        : [];

      const paragraphKeywords = lessonsData.keywords 
        ? lessonsData.keywords.filter(k => k.paragraph_id === paragraph.id)
        : [];

      return {
        ...paragraph,
        quiz: paragraphQuizzes,
        writingExercises: paragraphExercises,
        keyWords: paragraphKeywords
      };
    });

    console.log(`📖 جلب الدرس ${lessonId} مع ${enrichedParagraphs.length} فقرة`);

    res.json({
      success: true,
      data: {
        ...foundLesson,
        paragraphs: enrichedParagraphs.sort((a, b) => a.order - b.order),
        courseInfo: relatedCourse ? {
          id: relatedCourse.id,
          title: relatedCourse.title,
          level: relatedCourse.level
        } : null
      }
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الدرس:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الدرس',
      error: error.message
    });
  }
});

// ===================================
// Paragraphs API - مسارات الفقرات
// ===================================

// جلب فقرة محددة مع جميع محتوياتها
app.get('/api/paragraphs/:paragraphId', (req, res) => {
  try {
    const paragraphId = parseInt(req.params.paragraphId);
    let foundParagraph = null;
    let foundLesson = null;
    let foundCourse = null;

    // البحث عن الفقرة في جميع الكورسات والدروس
    outerLoop: for (const course of lessonsData.courses) {
      for (const lesson of course.lessons) {
        const paragraph = lesson.paragraphs.find(p => p.id === paragraphId);
        if (paragraph) {
          foundParagraph = paragraph;
          foundLesson = lesson;
          foundCourse = course;
          break outerLoop;
        }
      }
    }

    if (!foundParagraph) {
      return res.status(404).json({
        success: false,
        message: 'الفقرة غير موجودة'
      });
    }

    res.json({
      success: true,
      data: {
        ...foundParagraph,
        lessonInfo: {
          id: foundLesson.id,
          title: foundLesson.title
        },
        courseInfo: {
          id: foundCourse.id,
          title: foundCourse.title
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفقرة',
      error: error.message
    });
  }
});

// ===================================
// Quiz API - مسارات الاختبارات
// ===================================

// إرسال إجابات الاختبار وتقييمها
app.post('/api/quiz/submit', (req, res) => {
  try {
    const { paragraphId, answers } = req.body;

    if (!paragraphId || !answers) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير كاملة'
      });
    }

    // العثور على الفقرة
    let foundParagraph = null;
    outerLoop: for (const course of lessonsData.courses) {
      for (const lesson of course.lessons) {
        const paragraph = lesson.paragraphs.find(p => p.id === paragraphId);
        if (paragraph) {
          foundParagraph = paragraph;
          break outerLoop;
        }
      }
    }

    if (!foundParagraph) {
      return res.status(404).json({
        success: false,
        message: 'الفقرة غير موجودة'
      });
    }

    // تقييم الإجابات
    const quiz = foundParagraph.quiz;
    const results = [];
    let correctCount = 0;

    answers.forEach((answer, index) => {
      if (quiz[index]) {
        const isCorrect = answer === quiz[index].correctAnswer;
        if (isCorrect) correctCount++;
        
        results.push({
          questionId: quiz[index].id,
          question: quiz[index].question,
          questionAr: quiz[index].questionAr,
          userAnswer: answer,
          correctAnswer: quiz[index].correctAnswer,
          isCorrect: isCorrect,
          explanation: quiz[index].explanation,
          explanationAr: quiz[index].explanationAr
        });
      }
    });

    const score = Math.round((correctCount / quiz.length) * 100);
    const grade = score >= 90 ? 'A+' : 
                  score >= 80 ? 'A' : 
                  score >= 70 ? 'B' : 
                  score >= 60 ? 'C' : 
                  score >= 50 ? 'D' : 'F';

    res.json({
      success: true,
      data: {
        score: score,
        grade: grade,
        correctAnswers: correctCount,
        totalQuestions: quiz.length,
        results: results,
        passed: score >= 60
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تقييم الاختبار',
      error: error.message
    });
  }
});

// ===================================
// Writing Exercises API - مسارات تمارين الكتابة
// ===================================

// فحص إجابة تمرين الكتابة
app.post('/api/writing/check', (req, res) => {
  try {
    const { paragraphId, exerciseId, answer } = req.body;

    if (!paragraphId || !exerciseId || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'بيانات غير كاملة'
      });
    }

    // العثور على التمرين
    let foundExercise = null;
    outerLoop: for (const course of lessonsData.courses) {
      for (const lesson of course.lessons) {
        for (const paragraph of lesson.paragraphs) {
          if (paragraph.id === paragraphId) {
            foundExercise = paragraph.writingExercises.find(ex => ex.id === exerciseId);
            if (foundExercise) break outerLoop;
          }
        }
      }
    }

    if (!foundExercise) {
      return res.status(404).json({
        success: false,
        message: 'التمرين غير موجود'
      });
    }

    // فحص الإجابة (غير حساس للحالة والمسافات)
    const userAnswer = answer.toString().trim().toLowerCase();
    const correctAnswer = foundExercise.correctAnswer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    // حساب مستوى التشابه للإجابات القريبة
    const similarity = calculateSimilarity(userAnswer, correctAnswer);
    const isClose = similarity > 0.8 && !isCorrect;

    res.json({
      success: true,
      data: {
        isCorrect: isCorrect,
        isClose: isClose,
        userAnswer: answer,
        correctAnswer: foundExercise.correctAnswer,
        similarity: similarity,
        feedback: isCorrect ? 'إجابة صحيحة! ممتاز!' : 
                  isClose ? 'قريب جداً! تحقق من التهجئة.' :
                  'إجابة خاطئة. حاول مرة أخرى.',
        hint: !isCorrect ? foundExercise.hint : null,
        hintAr: !isCorrect ? foundExercise.hintAr : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في فحص التمرين',
      error: error.message
    });
  }
});

// ===================================
// Search API - مسارات البحث
// ===================================

// البحث في المحتوى
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'نص البحث مطلوب'
      });
    }

    const searchResults = [];
    const searchTerm = query.toLowerCase();

    // البحث في جميع المحتويات
    lessonsData.courses.forEach(course => {
      course.lessons.forEach(lesson => {
        lesson.paragraphs.forEach(paragraph => {
          // البحث في العنوان والمحتوى
          if (paragraph.title.toLowerCase().includes(searchTerm) ||
              paragraph.content.toLowerCase().includes(searchTerm) ||
              paragraph.translation.toLowerCase().includes(searchTerm)) {
            
            searchResults.push({
              type: 'paragraph',
              id: paragraph.id,
              title: paragraph.title,
              content: paragraph.content.substring(0, 200) + '...',
              translation: paragraph.translation.substring(0, 200) + '...',
              courseTitle: course.title,
              lessonTitle: lesson.title,
              courseId: course.id,
              lessonId: lesson.id
            });
          }

          // البحث في الكلمات المفتاحية
          paragraph.keyWords.forEach(word => {
            if (word.word.toLowerCase().includes(searchTerm) ||
                word.translation.toLowerCase().includes(searchTerm)) {
              
              searchResults.push({
                type: 'keyword',
                word: word.word,
                translation: word.translation,
                pronunciation: word.pronunciation,
                example: word.example,
                courseTitle: course.title,
                lessonTitle: lesson.title,
                courseId: course.id,
                lessonId: lesson.id,
                paragraphId: paragraph.id
              });
            }
          });
        });
      });
    });

    res.json({
      success: true,
      data: searchResults,
      total: searchResults.length,
      query: query
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في البحث',
      error: error.message
    });
  }
});

// ===================================
// Statistics API - مسارات الإحصائيات
// ===================================

// جلب إحصائيات عامة للمنصة
app.get('/api/stats', (req, res) => {
  try {
    console.log('📊 طلب الإحصائيات...');
    
    const totalCourses = lessonsData.courses ? lessonsData.courses.length : 0;
    const totalLessons = lessonsData.lessons ? lessonsData.lessons.length : 0;
    const totalParagraphs = lessonsData.paragraphs ? lessonsData.paragraphs.length : 0;
    const totalQuizzes = lessonsData.quizzes ? lessonsData.quizzes.length : 0;
    const totalExercises = lessonsData.exercises ? lessonsData.exercises.length : 0;
    const totalKeywords = lessonsData.keywords ? lessonsData.keywords.length : 0;
    
    // حساب إجمالي الطلاب
    const totalStudents = lessonsData.courses ? 
      lessonsData.courses.reduce((sum, course) => sum + (course.students || 0), 0) : 0;

    const stats = {
      totalCourses,
      totalLessons,
      totalParagraphs,
      totalQuizzes,
      totalExercises,
      totalKeywords,
      totalStudents,
      lastUpdated: new Date().toISOString()
    };

    console.log('✅ الإحصائيات جاهزة:', stats);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ خطأ في الإحصائيات:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات',
      error: error.message
    });
  }
});

// ===================================
// Helper Functions - الوظائف المساعدة
// ===================================

// حساب التشابه بين نصين
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// حساب مسافة Levenshtein
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// ===================================
// Error Handling - معالجة الأخطاء
// ===================================

// معالجة الروابط غير الموجودة
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      'GET /api/courses',
      'GET /api/courses/:id',
      'GET /api/lessons/:id',
      'GET /api/paragraphs/:id',
      'POST /api/quiz/submit',
      'POST /api/writing/check',
      'GET /api/search',
      'GET /api/stats'
    ]
  });
});

// معالجة الأخطاء العامة
app.use((error, req, res, next) => {
  console.error('خطأ في السيرفر:', error);
  res.status(500).json({
    success: false,
    message: 'خطأ داخلي في السيرفر',
    error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي'
  });
});

// ===================================
// Server Start - بدء تشغيل السيرفر
// ===================================

app.listen(PORT, () => {
  console.log(`
🚀 سيرفر منصة تعليم اللغات يعمل بنجاح!
📍 العنوان: http://localhost:${PORT}
📚 API التوثيق: http://localhost:${PORT}/
🌐 الكورسات: http://localhost:${PORT}/api/courses
📖 الإحصائيات: http://localhost:${PORT}/api/stats
🔍 البحث: http://localhost:${PORT}/api/search?q=hello
🎯 جاهز لاستقبال الطلبات!
  `);
});

// تصدير التطبيق للاختبار
module.exports = app;