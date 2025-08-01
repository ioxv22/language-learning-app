// صفحة الدرس المفرد - Lesson Page
// تعرض تفاصيل درس واحد مع البطاقات التعليمية والاختبار

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { FlashcardSet } from '../components/Flashcard';
import Quiz from '../components/Quiz';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMode, setCurrentMode] = useState('overview'); // overview, flashcards, quiz

  // جلب بيانات الدرس
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLesson(lessonId);
        setLesson(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب الدرس:', err);
        setError('حدث خطأ في تحميل الدرس');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  // مكون التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الدرس...</p>
        </div>
      </div>
    );
  }

  // مكون الخطأ
  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error || 'الدرس غير موجود'}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => navigate('/lessons')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              العودة للدروس
            </button>
          </div>
        </div>
      </div>
    );
  }

  // معالج إنهاء الاختبار
  const handleQuizComplete = (results) => {
    console.log('نتائج الاختبار:', results);
    // يمكن هنا حفظ النتائج أو إرسالها للخادم
    setCurrentMode('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {/* شريط التنقل */}
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-500">الرئيسية</Link>
              <i className="fas fa-chevron-left text-xs"></i>
              <Link 
                to={`/chapters/${lesson.chapterInfo?.id || lesson.chapterId}`} 
                className="hover:text-blue-500"
              >
                {lesson.chapterInfo?.title || 'الفصول'}
              </Link>
              <i className="fas fa-chevron-left text-xs"></i>
              <span className="text-gray-800 font-medium">{lesson.title}</span>
            </nav>

            {/* أزرار التنقل بين الدروس */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/lessons/${parseInt(lessonId) - 1}`)}
                disabled={parseInt(lessonId) <= 1}
                className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title="الدرس السابق"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              <button
                onClick={() => navigate(`/lessons/${parseInt(lessonId) + 1}`)}
                className="p-2 text-gray-500 hover:text-blue-500"
                title="الدرس التالي"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>

          {/* عنوان الدرس */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {lesson.title}
            </h1>
            <p className="text-xl text-gray-600 english-text mb-4">
              {lesson.title_en}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {lesson.description}
            </p>
          </div>

          {/* إحصائيات الدرس */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{lesson.wordsCount}</div>
                <div className="text-sm text-gray-600">كلمة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(lesson.wordsCount * 1.5)} {/* تقدير وقت التعلم */}
                </div>
                <div className="text-sm text-gray-600">دقيقة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {lesson.chapterInfo?.title || `الفصل ${lesson.chapterId}`}
                </div>
                <div className="text-sm text-gray-600">الفصل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط أوضاع التعلم */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentMode('overview')}
                className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  currentMode === 'overview' 
                    ? 'bg-white text-blue-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-list text-sm"></i>
                نظرة عامة
              </button>
              
              <button
                onClick={() => setCurrentMode('flashcards')}
                className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  currentMode === 'flashcards' 
                    ? 'bg-white text-green-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-clone text-sm"></i>
                البطاقات التعليمية
              </button>
              
              <button
                onClick={() => setCurrentMode('quiz')}
                className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  currentMode === 'quiz' 
                    ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-clipboard-check text-sm"></i>
                الاختبار
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-8">
        {currentMode === 'overview' && (
          <LessonOverview lesson={lesson} onModeChange={setCurrentMode} />
        )}
        
        {currentMode === 'flashcards' && (
          <div className="max-w-4xl mx-auto">
            <FlashcardSet 
              words={lesson.words} 
              title={`بطاقات درس: ${lesson.title}`}
            />
          </div>
        )}
        
        {currentMode === 'quiz' && (
          <div className="max-w-4xl mx-auto">
            <Quiz 
              words={lesson.words} 
              title={`اختبار درس: ${lesson.title}`}
              onComplete={handleQuizComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// مكون النظرة العامة على الدرس
const LessonOverview = ({ lesson, onModeChange }) => {
  return (
    <div className="max-w-4xl mx-auto">
      
      {/* أزرار البدء السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white text-center card-hover">
          <i className="fas fa-clone text-4xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-4">البطاقات التعليمية</h2>
          <p className="text-green-100 mb-6">
            تعلم الكلمات باستخدام البطاقات التفاعلية مع ميزة النطق الصوتي
          </p>
          <button
            onClick={() => onModeChange('flashcards')}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors btn-press"
          >
            ابدأ التعلم
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white text-center card-hover">
          <i className="fas fa-clipboard-check text-4xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-4">اختبار الدرس</h2>
          <p className="text-purple-100 mb-6">
            اختبر معرفتك بكلمات الدرس واحصل على تقرير مفصل عن أدائك
          </p>
          <button
            onClick={() => onModeChange('quiz')}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors btn-press"
          >
            ابدأ الاختبار
          </button>
        </div>
      </div>

      {/* قائمة الكلمات */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <i className="fas fa-language text-blue-500"></i>
            كلمات الدرس ({lesson.words.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {lesson.words.map((word, index) => (
            <WordItem key={word.id} word={word} index={index} />
          ))}
        </div>
      </div>

      {/* نصائح للدراسة */}
      <div className="mt-12 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          <i className="fas fa-lightbulb text-yellow-500 ml-2"></i>
          نصائح لدراسة هذا الدرس
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="fas fa-eye text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">اقرأ أولاً</h3>
              <p className="text-gray-600 text-sm">
                اطلع على جميع الكلمات والجمل قبل البدء بالبطاقات التعليمية
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="fas fa-volume-up text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">استمع للنطق</h3>
              <p className="text-gray-600 text-sm">
                اضغط على أيقونة الصوت للاستماع للنطق الصحيح لكل كلمة
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="fas fa-repeat text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">كرر المراجعة</h3>
              <p className="text-gray-600 text-sm">
                راجع البطاقات عدة مرات حتى تحفظ جميع الكلمات
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <i className="fas fa-clipboard-check text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">اختبر نفسك</h3>
              <p className="text-gray-600 text-sm">
                استخدم الاختبار لقياس مدى حفظك للكلمات والتأكد من فهمها
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون عنصر الكلمة المفردة
const WordItem = ({ word, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // وظيفة تشغيل النطق
  const speakText = (text, language = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم ميزة النطق الصوتي');
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 english-text">{word.english}</h3>
            <p className="text-lg text-gray-600">{word.arabic}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => speakText(word.english, 'en-US')}
            disabled={isPlaying}
            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="استمع للنطق الإنجليزي"
          >
            <i className={`fas fa-volume-up ${isPlaying ? 'fa-bounce' : ''}`}></i>
          </button>
          <button
            onClick={() => speakText(word.arabic, 'ar-SA')}
            disabled={isPlaying}
            className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="استمع للنطق العربي"
          >
            <i className={`fas fa-volume-up ${isPlaying ? 'fa-bounce' : ''}`}></i>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-700 mb-2">
          <i className="fas fa-quote-left text-gray-400 ml-2"></i>
          أمثلة:
        </h4>
        <div className="space-y-2">
          <p className="english-text text-gray-800">
            <i className="fas fa-circle text-blue-400 text-xs ml-2"></i>
            "{word.example_en}"
          </p>
          <p className="text-gray-600">
            <i className="fas fa-circle text-green-400 text-xs ml-2"></i>
            "{word.example_ar}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;