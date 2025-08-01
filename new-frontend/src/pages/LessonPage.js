// ===================================
// LessonPage Component - صفحة الدرس
// تعرض تفاصيل درس واحد مع جميع فقراته
// ===================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { lessonsAPI } from '../services/api';
import ParagraphView from '../components/ParagraphView';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await lessonsAPI.getById(lessonId);
        setLesson(response.data);
        
        // إذا كان هناك فقرة محددة في URL
        const paragraphId = searchParams.get('paragraph');
        if (paragraphId && response.data.paragraphs) {
          const paragraphIndex = response.data.paragraphs.findIndex(
            p => p.id === parseInt(paragraphId)
          );
          if (paragraphIndex !== -1) {
            setCurrentParagraphIndex(paragraphIndex);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب الدرس:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId, searchParams]);

  // التنقل بين الفقرات
  const goToParagraph = (index) => {
    if (index >= 0 && index < lesson.paragraphs.length) {
      setCurrentParagraphIndex(index);
      // تحديث URL بدون إعادة تحميل الصفحة
      const newParams = new URLSearchParams(searchParams);
      newParams.set('paragraph', lesson.paragraphs[index].id.toString());
      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    }
  };

  const goToNextParagraph = () => {
    goToParagraph(currentParagraphIndex + 1);
  };

  const goToPreviousParagraph = () => {
    goToParagraph(currentParagraphIndex - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الدرس...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-danger-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error || 'الدرس غير موجود'}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="btn btn-secondary"
            >
              العودة للكورسات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentParagraph = lesson.paragraphs[currentParagraphIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          
          {/* شريط التنقل */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary-600">الرئيسية</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            <Link to="/courses" className="hover:text-primary-600">الكورسات</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            {lesson.courseInfo && (
              <>
                <Link 
                  to={`/courses/${lesson.courseInfo.id}`} 
                  className="hover:text-primary-600"
                >
                  {lesson.courseInfo.title}
                </Link>
                <i className="fas fa-chevron-left text-xs"></i>
              </>
            )}
            <span className="text-gray-800 font-medium">{lesson.title}</span>
          </nav>

          {/* معلومات الدرس */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {lesson.title}
              </h1>
              <p className="text-gray-600">{lesson.description}</p>
            </div>

            {/* أزرار التنقل بين الدروس */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/lessons/${parseInt(lessonId) - 1}`)}
                disabled={parseInt(lessonId) <= 1}
                className="p-2 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="الدرس السابق"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              <button
                onClick={() => navigate(`/lessons/${parseInt(lessonId) + 1}`)}
                className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                title="الدرس التالي"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
          </div>

          {/* تبويبات الفقرات */}
          {lesson.paragraphs && lesson.paragraphs.length > 1 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <span className="text-sm text-gray-600 whitespace-nowrap">الفقرات:</span>
                {lesson.paragraphs.map((paragraph, index) => (
                  <button
                    key={paragraph.id}
                    onClick={() => goToParagraph(index)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm ${
                      currentParagraphIndex === index
                        ? 'bg-primary-600 text-white font-semibold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}. {paragraph.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* شريط التقدم */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>التقدم في الدرس:</span>
              <span>{currentParagraphIndex + 1} من {lesson.paragraphs.length}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill transition-all duration-300" 
                style={{ 
                  width: `${((currentParagraphIndex + 1) / lesson.paragraphs.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-8">
        {currentParagraph && (
          <ParagraphView 
            paragraph={currentParagraph}
            onComplete={goToNextParagraph}
          />
        )}

        {/* أزرار التنقل بين الفقرات */}
        <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
          
          {/* الفقرة السابقة */}
          <div className="w-1/3">
            {currentParagraphIndex > 0 && (
              <button
                onClick={goToPreviousParagraph}
                className="btn btn-outline flex items-center gap-2 w-full justify-center sm:justify-start"
              >
                <i className="fas fa-arrow-right"></i>
                <div className="text-right">
                  <div className="text-sm text-gray-500">السابق</div>
                  <div className="font-medium truncate">
                    {lesson.paragraphs[currentParagraphIndex - 1].title}
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* العودة للقائمة */}
          <div className="w-1/3 text-center">
            <Link
              to={`/courses/${lesson.courseInfo?.id || ''}`}
              className="btn btn-secondary"
            >
              <i className="fas fa-list mr-2"></i>
              قائمة الدروس
            </Link>
          </div>

          {/* الفقرة التالية */}
          <div className="w-1/3 text-left">
            {currentParagraphIndex < lesson.paragraphs.length - 1 ? (
              <button
                onClick={goToNextParagraph}
                className="btn btn-primary flex items-center gap-2 w-full justify-center sm:justify-end"
              >
                <div className="text-left">
                  <div className="text-sm text-blue-100">التالي</div>
                  <div className="font-medium truncate">
                    {lesson.paragraphs[currentParagraphIndex + 1].title}
                  </div>
                </div>
                <i className="fas fa-arrow-left"></i>
              </button>
            ) : (
              <div className="text-center">
                <div className="text-success-600 mb-2">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <div className="text-sm font-semibold text-success-600">
                  أكملت الدرس!
                </div>
                <Link
                  to={`/lessons/${parseInt(lessonId) + 1}`}
                  className="btn btn-success text-sm mt-2"
                >
                  الدرس التالي
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* معلومات إضافية عن الدرس */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-info-circle text-primary-600 ml-2"></i>
              معلومات الدرس
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {lesson.paragraphs.length}
                </div>
                <div className="text-gray-600">فقرة تعليمية</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 mb-2">
                  {lesson.paragraphs.reduce((total, p) => total + (p.quiz?.length || 0), 0)}
                </div>
                <div className="text-gray-600">سؤال اختبار</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600 mb-2">
                  {lesson.paragraphs.reduce((total, p) => total + (p.writingExercises?.length || 0), 0)}
                </div>
                <div className="text-gray-600">تمرين كتابة</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;