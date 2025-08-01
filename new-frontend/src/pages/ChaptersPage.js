// ===================================
// ChaptersPage Component - صفحة جميع الدروس
// تعرض جميع الدروس من جميع الكورسات
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, progressAPI } from '../services/api';

const ChaptersPage = () => {
  const [allLessons, setAllLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const coursesResponse = await coursesAPI.getAll();
        const coursesData = coursesResponse.data || [];
        setCourses(coursesData);

        // جلب جميع الدروس من جميع الكورسات
        const allLessonsData = [];
        
        for (const course of coursesData) {
          try {
            const lessonsResponse = await coursesAPI.getLessons(course.id);
            const lessons = lessonsResponse.data || [];
            
            // إضافة معلومات الكورس لكل درس
            const lessonsWithCourse = lessons.map(lesson => ({
              ...lesson,
              courseInfo: {
                id: course.id,
                title: course.title,
                level: course.level
              }
            }));
            
            allLessonsData.push(...lessonsWithCourse);
          } catch (lessonError) {
            console.error(`خطأ في جلب دروس الكورس ${course.id}:`, lessonError);
          }
        }

        setAllLessons(allLessonsData);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError(err.message);
        // في حالة الخطأ، نعرض بيانات فارغة بدلاً من undefined
        setAllLessons([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // فلترة الدروس
  const filteredLessons = allLessons.filter(lesson => {
    const matchesCourse = filterCourse === 'all' || lesson.courseInfo?.id === parseInt(filterCourse);
    const matchesLevel = filterLevel === 'all' || lesson.courseInfo?.level === filterLevel;
    const matchesSearch = searchQuery === '' || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCourse && matchesLevel && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل جميع الدروس...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-danger-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ في تحميل البيانات</h2>
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
              <i className="fas fa-list text-primary-600 ml-3"></i>
              جميع الدروس
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تصفح جميع الدروس المتاحة من جميع الكورسات واختر ما يناسب مستواك
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* إحصائيات سريعة */}
        <div className="card mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {allLessons.length}
              </div>
              <div className="text-gray-600">درس إجمالي</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-600 mb-2">
                {courses.length}
              </div>
              <div className="text-gray-600">كورس متاح</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {filteredLessons.length}
              </div>
              <div className="text-gray-600">درس مفلتر</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {allLessons.reduce((total, lesson) => total + (lesson.paragraphsCount || 0), 0)}
              </div>
              <div className="text-gray-600">فقرة تعليمية</div>
            </div>
          </div>
        </div>

        {/* أدوات الفلترة والبحث */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">تصفية وبحث الدروس:</h2>
          
          {/* شريط البحث */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في أسماء الدروس..."
                className="input pl-12 pr-4"
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* فلاتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* فلتر الكورس */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فلترة حسب الكورس:
              </label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="input"
              >
                <option value="all">جميع الكورسات ({allLessons.length})</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({allLessons.filter(l => l.courseInfo?.id === course.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* فلتر المستوى */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فلترة حسب المستوى:
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="input"
              >
                <option value="all">جميع المستويات</option>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>
            </div>
          </div>

          {/* مسح الفلاتر */}
          {(filterCourse !== 'all' || filterLevel !== 'all' || searchQuery !== '') && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setFilterCourse('all');
                  setFilterLevel('all');
                  setSearchQuery('');
                }}
                className="btn btn-outline text-sm"
              >
                <i className="fas fa-times mr-2"></i>
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* قائمة الدروس */}
        {filteredLessons.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد دروس</h2>
            <p className="text-gray-500">
              {searchQuery ? `لا توجد دروس تتطابق مع البحث "${searchQuery}"` : 'لا توجد دروس تتطابق مع الفلاتر المحددة'}
            </p>
            {(filterCourse !== 'all' || filterLevel !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setFilterCourse('all');
                  setFilterLevel('all');
                  setSearchQuery('');
                }}
                className="btn btn-primary mt-4"
              >
                عرض جميع الدروس
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLessons.map((lesson, index) => (
              <LessonCard key={`${lesson.courseInfo?.id}-${lesson.id}`} lesson={lesson} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// مكون بطاقة الدرس
const LessonCard = ({ lesson, index }) => {
  const progress = progressAPI.getProgress(lesson.id).progress;
  const isCompleted = progress >= 100;
  const isInProgress = progress > 0 && progress < 100;

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

  return (
    <div className="card card-hover group">
      
      {/* رأس البطاقة */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
            isCompleted ? 'bg-success-500 text-white' :
            isInProgress ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {isCompleted ? (
              <i className="fas fa-check"></i>
            ) : (
              index + 1
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
              {lesson.title}
            </h3>
            {lesson.courseInfo && (
              <div className="flex items-center gap-2 mt-1">
                <Link 
                  to={`/courses/${lesson.courseInfo.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {lesson.courseInfo.title}
                </Link>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  levelColors[lesson.courseInfo.level] || 'bg-gray-100 text-gray-800'
                }`}>
                  {levelText[lesson.courseInfo.level] || 'غير محدد'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* حالة الإكمال */}
        {isCompleted && (
          <div className="bg-success-100 text-success-600 px-2 py-1 rounded-full text-xs font-semibold">
            <i className="fas fa-trophy mr-1"></i>
            مكتمل
          </div>
        )}
      </div>

      {/* الوصف */}
      <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

      {/* الإحصائيات */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary-600">
            {lesson.paragraphsCount || 0}
          </div>
          <div className="text-xs text-gray-600">فقرة</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning-600">
            {lesson.quizzesCount || 0}
          </div>
          <div className="text-xs text-gray-600">سؤال</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success-600">
            {lesson.estimatedTime || '10-15'}
          </div>
          <div className="text-xs text-gray-600">دقيقة</div>
        </div>
      </div>

      {/* شريط التقدم */}
      {(isInProgress || isCompleted) && (
        <div className="mb-4">
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

      {/* أزرار العمل */}
      <div className="flex gap-2">
        <Link
          to={`/lessons/${lesson.id}`}
          className={`btn flex-1 justify-center ${
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

        {lesson.courseInfo && (
          <Link
            to={`/courses/${lesson.courseInfo.id}`}
            className="btn btn-secondary px-4"
            title="عرض الكورس"
          >
            <i className="fas fa-book"></i>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ChaptersPage;