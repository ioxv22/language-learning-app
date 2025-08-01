// ===================================
// CourseDetailsPage Component - صفحة تفاصيل الكورس
// تعرض تفاصيل كورس محدد مع دروسه
// ===================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, progressAPI } from '../services/api';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 جلب بيانات الكورس:', courseId);
        
        // جلب بيانات الكورس والدروس
        const [courseResponse, lessonsResponse] = await Promise.all([
          coursesAPI.getById(courseId),
          coursesAPI.getLessons(courseId)
        ]);

        console.log('✅ تم جلب بيانات الكورس:', courseResponse);
        console.log('✅ تم جلب الدروس:', lessonsResponse);

        setCourse(courseResponse.data);
        setLessons(lessonsResponse.data || []);

        // جلب تقدم كل درس (اختياري)
        const progressData = {};
        if (lessonsResponse.data && lessonsResponse.data.length > 0) {
          lessonsResponse.data.forEach(lesson => {
            try {
              const lessonProgress = progressAPI.getProgress(lesson.id);
              progressData[lesson.id] = lessonProgress.progress;
            } catch (progressError) {
              console.warn('تعذر جلب تقدم الدرس:', lesson.id, progressError);
              progressData[lesson.id] = 0;
            }
          });
        }
        setProgress(progressData);

      } catch (err) {
        console.error('❌ خطأ في جلب بيانات الكورس:', err);
        
        // رسائل خطأ أكثر وضوحاً
        if (err.response?.status === 404) {
          setError('الكورس المطلوب غير موجود');
        } else if (err.response?.status === 500) {
          setError('خطأ في الخادم. يرجى المحاولة لاحقاً');
        } else if (!err.response) {
          setError('تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت');
        } else {
          setError(err.message || 'حدث خطأ غير متوقع');
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الكورس...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-danger-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في جلب الدروس</h2>
          <p className="text-gray-600 mb-4">{error || 'تعذر تحميل بيانات الكورس'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary flex items-center justify-center gap-2"
            >
              <i className="fas fa-redo text-sm"></i>
              إعادة المحاولة
            </button>
            <Link to="/courses" className="btn btn-secondary flex items-center justify-center gap-2">
              <i className="fas fa-arrow-left text-sm"></i>
              العودة للكورسات
            </Link>
          </div>
          
          {/* معلومات تقنية للتطوير */}
          <div className="mt-4 text-xs text-gray-500">
            Course ID: {courseId} | {new Date().toLocaleString('ar')}
          </div>
        </div>
      </div>
    );
  }

  const totalProgress = lessons.length > 0 
    ? Math.round(Object.values(progress).reduce((sum, p) => sum + p, 0) / lessons.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="gradient-primary text-white">
        <div className="container mx-auto px-4 py-16">
          
          {/* شريط التنقل */}
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-8">
            <Link to="/" className="hover:text-white">الرئيسية</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            <Link to="/courses" className="hover:text-white">الكورسات</Link>
            <i className="fas fa-chevron-left text-xs"></i>
            <span className="text-white font-medium">{course.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* معلومات الكورس */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  course.level === 'beginner' ? 'bg-success-500' :
                  course.level === 'intermediate' ? 'bg-warning-500' : 'bg-danger-500'
                } text-white`}>
                  {course.level === 'beginner' ? 'مبتدئ' : 
                   course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {lessons.length} درس
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                {course.description}
              </p>

              {/* إحصائيات الكورس */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <i className="fas fa-list text-2xl mb-2"></i>
                  <div className="text-2xl font-bold">{lessons.length}</div>
                  <div className="text-sm text-blue-100">درس</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <i className="fas fa-paragraph text-2xl mb-2"></i>
                  <div className="text-2xl font-bold">{course.totalParagraphs}</div>
                  <div className="text-sm text-blue-100">فقرة</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <i className="fas fa-question-circle text-2xl mb-2"></i>
                  <div className="text-2xl font-bold">{course.totalQuizzes || 0}</div>
                  <div className="text-sm text-blue-100">سؤال</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <i className="fas fa-clock text-2xl mb-2"></i>
                  <div className="text-2xl font-bold">{course.estimatedTime || '2-3'}</div>
                  <div className="text-sm text-blue-100">ساعة</div>
                </div>
              </div>

              {/* شريط التقدم العام */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">التقدم العام:</span>
                  <span className="font-bold">{totalProgress}%</span>
                </div>
                <div className="progress-bar bg-white bg-opacity-30">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* زر البدء */}
            <div className="w-full lg:w-auto">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">ابدأ التعلم الآن</h3>
                
                {lessons.length > 0 && (
                  <Link
                    to={`/lessons/${lessons[0].id}`}
                    className="btn btn-primary w-full mb-4 justify-center"
                  >
                    <i className="fas fa-play mr-2"></i>
                    {totalProgress > 0 ? 'متابعة التعلم' : 'بدء الكورس'}
                  </Link>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check text-success-600"></i>
                    <span>وصول مجاني كامل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-volume-up text-primary-600"></i>
                    <span>نطق صوتي للكلمات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-certificate text-warning-600"></i>
                    <span>شهادة إتمام</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الدروس */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">محتوى الكورس</h2>
            <span className="text-gray-600">{lessons.length} درس</span>
          </div>

          {lessons.length > 0 ? (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  index={index + 1}
                  progress={progress[lesson.id] || 0}
                  isLocked={index > 0 && progress[lessons[index - 1].id] < 80}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-book text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد دروس متاحة</h3>
              <p className="text-gray-500">سيتم إضافة الدروس قريباً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// مكون بطاقة الدرس
const LessonCard = ({ lesson, index, progress, isLocked }) => {
  const isCompleted = progress >= 100;
  const isInProgress = progress > 0 && progress < 100;

  return (
    <div className={`card transition-all duration-200 ${
      isLocked ? 'opacity-60' : 'hover:shadow-lg'
    }`}>
      <div className="flex items-center gap-4">
        
        {/* رقم الدرس */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
          isCompleted ? 'bg-success-500 text-white' :
          isInProgress ? 'bg-primary-500 text-white' :
          isLocked ? 'bg-gray-300 text-gray-500' : 'bg-gray-100 text-gray-600'
        }`}>
          {isCompleted ? (
            <i className="fas fa-check"></i>
          ) : isLocked ? (
            <i className="fas fa-lock"></i>
          ) : (
            index
          )}
        </div>

        {/* معلومات الدرس */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {lesson.title}
          </h3>
          <p className="text-gray-600 mb-2">{lesson.description}</p>
          
          {/* معلومات إضافية */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <i className="fas fa-paragraph"></i>
              {lesson.paragraphsCount || 0} فقرة
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-clock"></i>
              {lesson.estimatedTime || '10-15'} دقيقة
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-question-circle"></i>
              {lesson.quizzesCount || 0} سؤال
            </span>
          </div>

          {/* شريط التقدم */}
          {(isInProgress || isCompleted) && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">التقدم:</span>
                <span className={`font-semibold ${
                  isCompleted ? 'text-success-600' : 'text-primary-600'
                }`}>
                  {progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-success-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* زر العمل */}
        <div className="flex flex-col gap-2">
          {!isLocked ? (
            <Link
              to={`/lessons/${lesson.id}`}
              className={`btn px-6 py-2 ${
                isCompleted ? 'btn-success' :
                isInProgress ? 'btn-primary' : 'btn-outline'
              }`}
            >
              {isCompleted ? (
                <>
                  <i className="fas fa-redo mr-2"></i>
                  مراجعة
                </>
              ) : isInProgress ? (
                <>
                  <i className="fas fa-play mr-2"></i>
                  متابعة
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-2"></i>
                  ابدأ
                </>
              )}
            </Link>
          ) : (
            <div className="px-6 py-2 bg-gray-200 text-gray-500 rounded-lg text-center">
              <i className="fas fa-lock mr-2"></i>
              مغلق
            </div>
          )}
          
          {/* معاينة */}
          <button className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <i className="fas fa-eye mr-1"></i>
            معاينة
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;