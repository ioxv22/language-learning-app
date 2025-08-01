// ===================================
// CoursesPage Component - صفحة الكورسات
// تعرض جميع الكورسات المتاحة مع تفاصيل كل كورس
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, statsAPI } from '../services/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        const [coursesResponse, statsResponse] = await Promise.all([
          coursesAPI.getAll(),
          statsAPI.getGeneral()
        ]);
        
        setCourses(coursesResponse.data);
        setStats(statsResponse.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب الكورسات:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // فلترة الكورسات حسب المستوى
  const filteredCourses = courses.filter(course => 
    filterLevel === 'all' || course.level === filterLevel
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الكورسات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-danger-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="fas fa-graduation-cap text-primary-600 ml-3"></i>
              الكورسات التعليمية
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر الكورس المناسب لمستواك وابدأ رحلة تعلم اللغة الإنجليزية بطريقة منظمة وتفاعلية
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* إحصائيات سريعة */}
        {stats && (
          <div className="card mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {stats.totalCourses}
                </div>
                <div className="text-gray-600">كورس متاح</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success-600 mb-2">
                  {stats.totalLessons}
                </div>
                <div className="text-gray-600">درس إجمالي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning-600 mb-2">
                  {stats.totalParagraphs}
                </div>
                <div className="text-gray-600">فقرة تعليمية</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.totalQuizzes}
                </div>
                <div className="text-gray-600">سؤال اختبار</div>
              </div>
            </div>
          </div>
        )}

        {/* فلتر المستوى */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">فلترة حسب المستوى:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterLevel === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              جميع الكورسات ({courses.length})
            </button>
            <button
              onClick={() => setFilterLevel('beginner')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterLevel === 'beginner' 
                  ? 'bg-success-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-seedling mr-2"></i>
              مبتدئ ({courses.filter(c => c.level === 'beginner').length})
            </button>
            <button
              onClick={() => setFilterLevel('intermediate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterLevel === 'intermediate' 
                  ? 'bg-warning-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>
              متوسط ({courses.filter(c => c.level === 'intermediate').length})
            </button>
            <button
              onClick={() => setFilterLevel('advanced')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterLevel === 'advanced' 
                  ? 'bg-danger-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="fas fa-trophy mr-2"></i>
              متقدم ({courses.filter(c => c.level === 'advanced').length})
            </button>
          </div>
        </div>

        {/* قائمة الكورسات */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد كورسات</h2>
            <p className="text-gray-500">
              {filterLevel === 'all' 
                ? 'لا توجد كورسات متاحة حالياً' 
                : `لا توجد كورسات في مستوى ${filterLevel === 'beginner' ? 'المبتدئ' : filterLevel === 'intermediate' ? 'المتوسط' : 'المتقدم'}`
              }
            </p>
            {filterLevel !== 'all' && (
              <button
                onClick={() => setFilterLevel('all')}
                className="btn btn-primary mt-4"
              >
                عرض جميع الكورسات
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>

            {/* نصائح للتعلم */}
            <div className="mt-16 gradient-primary rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <i className="fas fa-lightbulb text-yellow-300 ml-2"></i>
                نصائح للتعلم الفعال
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white text-primary-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-play text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">ابدأ بالأساسيات</h3>
                    <p className="text-blue-100 text-sm">
                      ابدأ بالكورس المناسب لمستواك وتقدم تدريجياً لضمان بناء أساس قوي
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white text-primary-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-volume-up text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">استمع للنطق</h3>
                    <p className="text-blue-100 text-sm">
                      استخدم ميزة النطق الصوتي لتحسين مهارات الاستماع والنطق
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white text-primary-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-clipboard-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">اختبر نفسك</h3>
                    <p className="text-blue-100 text-sm">
                      استخدم الاختبارات لقياس تقدمك وتحديد نقاط القوة والضعف
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white text-primary-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-pencil-alt text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">مارس الكتابة</h3>
                    <p className="text-blue-100 text-sm">
                      استخدم تمارين الكتابة لتثبيت المعلومات وتحسين مهارات الكتابة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// مكون بطاقة الكورس
const CourseCard = ({ course, index }) => {
  const gradients = [
    'from-primary-500 to-primary-600',
    'from-success-500 to-success-600',
    'from-warning-500 to-warning-600', 
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ];

  const levelColors = {
    beginner: 'bg-success-100 text-success-800',
    intermediate: 'bg-warning-100 text-warning-800', 
    advanced: 'bg-danger-100 text-danger-800'
  };

  const levelText = {
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم'
  };

  const gradient = gradients[index % gradients.length];

  return (
    <div className="card card-hover group overflow-hidden">
      
      {/* رأس البطاقة */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden -m-6 mb-6`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${levelColors[course.level]} bg-white`}>
              {levelText[course.level]}
            </span>
            <i className="fas fa-graduation-cap text-2xl opacity-75"></i>
          </div>
          
          <h2 className="text-xl font-bold mb-2 leading-tight line-clamp-2">
            {course.title}
          </h2>
        </div>
        
        {/* تأثير زخرفي */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 transform -translate-x-8 -translate-y-8">
          <i className="fas fa-book text-6xl"></i>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-primary-600 mb-1">
              {course.lessonsCount}
            </div>
            <div className="text-sm text-gray-600">درس</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-success-600 mb-1">
              {course.totalParagraphs}
            </div>
            <div className="text-sm text-gray-600">فقرة</div>
          </div>
        </div>

        {/* مؤشر الصعوبة */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">مستوى الصعوبة:</span>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${levelColors[course.level]}`}>
              {levelText[course.level]}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                course.level === 'beginner' ? 'bg-success-500' : 
                course.level === 'intermediate' ? 'bg-warning-500' : 'bg-danger-500'
              }`}
              style={{ 
                width: course.level === 'beginner' ? '33%' : 
                       course.level === 'intermediate' ? '66%' : '100%' 
              }}
            ></div>
          </div>
        </div>

        {/* أزرار العمل */}
        <div className="space-y-3">
          <Link
            to={`/courses/${course.id}`}
            className="block w-full btn btn-primary text-center group-hover:bg-primary-700 transition-colors"
          >
            <i className="fas fa-play mr-2"></i>
            ابدأ الكورس
          </Link>
          
          <Link
            to={`/courses/${course.id}/lessons`}
            className="block w-full btn btn-outline text-center"
          >
            <i className="fas fa-list mr-2"></i>
            عرض الدروس
          </Link>
        </div>
      </div>

      {/* شريط التقدم (للاستخدام المستقبلي) */}
      <div className="bg-gray-50 px-6 py-3 -mx-6 -mb-6 mt-6 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>التقدم:</span>
          <span>0% مكتمل</span>
        </div>
        <div className="progress-bar mt-2">
          <div className="progress-fill" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;