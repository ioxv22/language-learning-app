// الصفحة الرئيسية - Home Page
// تعرض نظرة عامة على التطبيق مع الإحصائيات والروابط السريعة

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const HomePage = () => {
  // الحالات المحلية
  const [stats, setStats] = useState(null);
  const [recentChapters, setRecentChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // جلب الإحصائيات والفصول بشكل متوازي
        const [statsResponse, chaptersResponse] = await Promise.all([
          apiService.getStats(),
          apiService.getChapters()
        ]);

        setStats(statsResponse.data);
        setRecentChapters(chaptersResponse.data.slice(0, 3)); // أول 3 فصول
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // مكون التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // مكون الخطأ
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-block bg-white bg-opacity-20 rounded-full p-6 mb-6">
                <i className="fas fa-graduation-cap text-6xl"></i>
              </div>
              <h1 className="text-5xl font-bold mb-4">
                مرحباً بك في موقع تعليم اللغات! 🌐
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                تعلم اللغة الإنجليزية بطريقة تفاعلية وممتعة مع بطاقات تعليمية واختبارات ذكية
              </p>
            </div>

            {/* الإحصائيات الرئيسية */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-book-open text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalChapters}</div>
                  <div className="text-blue-100">فصل تعليمي</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-list text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalLessons}</div>
                  <div className="text-blue-100">درس متنوع</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-language text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.totalWords}</div>
                  <div className="text-blue-100">كلمة وجملة</div>
                </div>
                
                <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center">
                  <i className="fas fa-chart-line text-3xl mb-3"></i>
                  <div className="text-3xl font-bold">{stats.averageWordsPerLesson}</div>
                  <div className="text-blue-100">كلمة/درس</div>
                </div>
              </div>
            )}

            {/* أزرار العمل الرئيسية */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chapters"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg
                           hover:bg-blue-50 transition-colors btn-press
                           flex items-center justify-center gap-3"
              >
                <i className="fas fa-book"></i>
                ابدأ التعلم الآن
              </Link>
              
              <Link
                to="/practice"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg
                           hover:bg-white hover:text-blue-600 transition-colors btn-press
                           flex items-center justify-center gap-3"
              >
                <i className="fas fa-brain"></i>
                مراجعة سريعة
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
              لماذا تختار موقعنا؟ ✨
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نوفر لك تجربة تعلم متكاملة مع أحدث التقنيات التفاعلية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* ميزة البطاقات التعليمية */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clone text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">بطاقات تفاعلية</h3>
              <p className="text-gray-600 text-sm">
                بطاقات ذكية تساعدك على حفظ الكلمات بطريقة ممتعة مع إمكانية التبديل بين الكلمة والترجمة
              </p>
            </div>

            {/* ميزة النطق الصوتي */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-volume-up text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">النطق الصوتي</h3>
              <p className="text-gray-600 text-sm">
                استمع للنطق الصحيح لكل كلمة وجملة باستخدام تقنية Text-to-Speech المدمجة في المتصفح
              </p>
            </div>

            {/* ميزة الاختبارات */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-check text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اختبارات ذكية</h3>
              <p className="text-gray-600 text-sm">
                اختبارات تفاعلية لقياس تقدمك مع تقارير مفصلة عن أدائك ونقاط القوة والضعف
              </p>
            </div>

            {/* ميزة التنظيم */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center card-hover">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-layer-group text-2xl text-yellow-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تنظيم ممتاز</h3>
              <p className="text-gray-600 text-sm">
                دروس منظمة في فصول واضحة مع تدرج منطقي من الأساسيات إلى المستويات المتقدمة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الفصول المتاحة */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              الفصول المتاحة 📚
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ابدأ رحلتك التعليمية مع فصولنا المنظمة والمتدرجة
            </p>
          </div>

          {recentChapters.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {recentChapters.map((chapter) => (
                <div key={chapter.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden card-hover">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
                    <p className="text-blue-100 text-sm english-text">{chapter.title_en}</p>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{chapter.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          <i className="fas fa-list ml-1"></i>
                          {chapter.lessonsCount} دروس
                        </span>
                        <span>
                          <i className="fas fa-language ml-1"></i>
                          {chapter.totalWords} كلمة
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/chapters/${chapter.id}`}
                      className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg
                                 hover:bg-blue-600 transition-colors btn-press font-semibold"
                    >
                      ابدأ التعلم
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/chapters"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-lg
                         hover:bg-blue-600 transition-colors btn-press font-bold"
            >
              عرض جميع الفصول
              <i className="fas fa-arrow-left"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* قسم كيفية البدء */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              كيف تبدأ؟ 🚀
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              خطوات بسيطة للبدء في رحلة تعلم اللغة الإنجليزية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اختر فصلاً</h3>
              <p className="text-gray-600">
                ابدأ بالفصول الأساسية أو اختر الفصل المناسب لمستواك
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تعلم بالبطاقات</h3>
              <p className="text-gray-600">
                استخدم البطاقات التفاعلية لحفظ الكلمات والاستماع للنطق
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">اختبر نفسك</h3>
              <p className="text-gray-600">
                قم بإجراء الاختبارات لقياس تقدمك والتأكد من فهمك للمحتوى
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            مستعد لبدء رحلة التعلم؟ 🎯
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الطلاب الذين يتعلمون اللغة الإنجليزية بطريقة ممتعة وفعالة
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chapters"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg
                         hover:bg-green-50 transition-colors btn-press
                         flex items-center justify-center gap-3"
            >
              <i className="fas fa-rocket"></i>
              ابدأ الآن مجاناً
            </Link>
            
            <Link
              to="/lessons"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg
                         hover:bg-white hover:text-green-600 transition-colors btn-press
                         flex items-center justify-center gap-3"
            >
              <i className="fas fa-list"></i>
              تصفح الدروس
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;