// ===================================
// HomePage Component - الصفحة الرئيسية
// تعرض نظرة عامة على المنصة والكورسات المتاحة
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, statsAPI } from '../services/api';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // جلب البيانات بشكل متوازي
        const [coursesResponse, statsResponse] = await Promise.all([
          coursesAPI.getAll(),
          statsAPI.getGeneral()
        ]);

        setCourses(coursesResponse.data);
        setStats(statsResponse.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
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
      
      {/* قسم الترحيب والمقدمة */}
      <section className="gradient-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-block bg-white bg-opacity-20 rounded-full p-6 mb-6">
                <i className="fas fa-graduation-cap text-6xl"></i>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                مرحباً بك في منصة تعليم اللغات! 🌐
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                تعلم اللغة الإنجليزية بطريقة تفاعلية وممتعة مع فقرات تعليمية واضحة واختبارات ذكية وتمارين كتابة
              </p>
            </div>

            {/* الإحصائيات الرئيسية */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-book text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalCourses}</div>
                  <div className="text-blue-100">كورس تعليمي</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-list text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalLessons}</div>
                  <div className="text-blue-100">درس متنوع</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-paragraph text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalParagraphs}</div>
                  <div className="text-blue-100">فقرة تعليمية</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-question-circle text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
                  <div className="text-blue-100">سؤال اختبار</div>
                </div>
              </div>
            )}

            {/* أزرار العمل الرئيسية */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors btn-press flex items-center justify-center gap-3"
              >
                <i className="fas fa-rocket"></i>
                ابدأ التعلم الآن
              </Link>
              
              <Link
                to="/search"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary-600 transition-colors btn-press flex items-center justify-center gap-3"
              >
                <i className="fas fa-search"></i>
                تصفح المحتوى
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الميزات الرئيسية */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              لماذا تختار منصتنا؟ ✨
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نوفر لك تجربة تعلم متكاملة مع أحدث التقنيات التفاعلية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* ميزة الفقرات التعليمية */}
            <div className="card card-hover text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-book-open text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">فقرات تعليمية</h3>
              <p className="text-gray-600 text-sm">
                محتوى تعليمي منظم ومقسم إلى فقرات واضحة مع ترجمة دقيقة وكلمات مفتاحية
              </p>
            </div>

            {/* ميزة النطق الصوتي */}
            <div className="card card-hover text-center">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-volume-up text-2xl text-success-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">النطق الصوتي</h3>
              <p className="text-gray-600 text-sm">
                استمع للنطق الصحيح لكل كلمة وجملة باستخدام تقنية Text-to-Speech المتقدمة
              </p>
            </div>

            {/* ميزة الاختبارات */}
            <div className="card card-hover text-center">
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-check text-2xl text-warning-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اختبارات تفاعلية</h3>
              <p className="text-gray-600 text-sm">
                اختبارات اختيار من متعدد بعد كل فقرة لتقييم فهمك مع نتائج مفصلة
              </p>
            </div>

            {/* ميزة تمارين الكتابة */}
            <div className="card card-hover text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-pencil-alt text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تمارين الكتابة</h3>
              <p className="text-gray-600 text-sm">
                تمارين كتابة تفاعلية مع تحقق فوري من الإجابات وتلميحات مفيدة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الكورسات المتاحة */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              الكورسات المتاحة 📚
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ابدأ رحلتك التعليمية مع كورساتنا المنظمة والمتدرجة
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-book text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد كورسات متاحة حالياً</h3>
              <p className="text-gray-500">سيتم إضافة المزيد من الكورسات قريباً</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/courses"
              className="btn btn-primary px-8 py-3 text-lg"
            >
              عرض جميع الكورسات
              <i className="fas fa-arrow-left mr-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* قسم كيفية البدء */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              كيف تبدأ التعلم؟ 🚀
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              خطوات بسيطة للبدء في رحلة تعلم اللغة الإنجليزية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اختر كورساً</h3>
              <p className="text-gray-600">
                ابدأ بالكورسات الأساسية أو اختر الكورس المناسب لمستواك
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اقرأ الفقرات</h3>
              <p className="text-gray-600">
                اقرأ المحتوى التعليمي واستمع للنطق الصحيح للكلمات
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warning-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">أجب على الاختبارات</h3>
              <p className="text-gray-600">
                اختبر فهمك للمحتوى من خلال أسئلة اختيار من متعدد
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">مارس الكتابة</h3>
              <p className="text-gray-600">
                تدرب على الكتابة من خلال تمارين تفاعلية مع تصحيح فوري
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل */}
      <section className="gradient-success text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            مستعد لبدء رحلة التعلم؟ 🎯
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الطلاب الذين يتعلمون اللغة الإنجليزية بطريقة تفاعلية وممتعة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-success-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors btn-press flex items-center justify-center gap-3"
            >
              <i className="fas fa-rocket"></i>
              ابدأ الآن مجاناً
            </Link>
            
            <Link
              to="/search"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-success-600 transition-colors btn-press flex items-center justify-center gap-3"
            >
              <i className="fas fa-search"></i>
              استكشف المحتوى
            </Link>
          </div>
        </div>
      </section>
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

  const gradient = gradients[index % gradients.length];

  return (
    <div className="card card-hover group overflow-hidden">
      
      {/* رأس البطاقة */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden -m-6 mb-6`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
              {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
            </span>
            <i className="fas fa-graduation-cap text-2xl opacity-75"></i>
          </div>
          
          <h2 className="text-xl font-bold mb-2 leading-tight">{course.title}</h2>
        </div>
        
        {/* تأثير زخرفي في الخلفية */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 transform -translate-x-8 -translate-y-8">
          <i className="fas fa-book text-6xl"></i>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">{course.description}</p>

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

        {/* زر العمل */}
        <Link
          to={`/courses/${course.id}`}
          className="block w-full btn btn-primary text-center group-hover:bg-primary-700 transition-colors"
        >
          <i className="fas fa-play mr-2"></i>
          ابدأ الكورس
        </Link>
      </div>
    </div>
  );
};

export default HomePage;