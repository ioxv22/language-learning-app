// صفحة الفصول - Chapters Page
// تعرض جميع الفصول المتاحة مع تفاصيل كل فصل

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const ChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الفصول عند تحميل الصفحة
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await apiService.getChapters();
        setChapters(response.data);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب الفصول:', err);
        setError('حدث خطأ في تحميل الفصول');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // مكون التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الفصول...</p>
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
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="fas fa-book-open text-blue-500 ml-3"></i>
              الفصول التعليمية
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر الفصل المناسب لمستواك وابدأ رحلة تعلم اللغة الإنجليزية بطريقة منظمة ومتدرجة
            </p>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="container mx-auto px-4 py-12">
        {chapters.length === 0 ? (
          // رسالة عدم وجود فصول
          <div className="text-center py-16">
            <i className="fas fa-book text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد فصول متاحة</h2>
            <p className="text-gray-500">سيتم إضافة المزيد من الفصول قريباً</p>
          </div>
        ) : (
          <>
            {/* إحصائيات سريعة */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {chapters.length}
                  </div>
                  <div className="text-gray-600">فصل متاح</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {chapters.reduce((sum, chapter) => sum + chapter.lessonsCount, 0)}
                  </div>
                  <div className="text-gray-600">درس إجمالي</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {chapters.reduce((sum, chapter) => sum + chapter.totalWords, 0)}
                  </div>
                  <div className="text-gray-600">كلمة وجملة</div>
                </div>
              </div>
            </div>

            {/* قائمة الفصول */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {chapters.map((chapter, index) => (
                <ChapterCard key={chapter.id} chapter={chapter} index={index} />
              ))}
            </div>

            {/* نصائح للتعلم */}
            <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                <i className="fas fa-lightbulb text-yellow-500 ml-2"></i>
                نصائح للتعلم الفعال
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">ابدأ بالأساسيات</h3>
                    <p className="text-gray-600 text-sm">
                      ابدأ بالفصل الأول وتقدم تدريجياً لضمان بناء أساس قوي
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-repeat text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">كرر المراجعة</h3>
                    <p className="text-gray-600 text-sm">
                      راجع الفصول السابقة بانتظام لتثبيت المعلومات في الذاكرة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-volume-up text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">استمع للنطق</h3>
                    <p className="text-gray-600 text-sm">
                      استخدم ميزة النطق الصوتي لتحسين مهارات الاستماع والنطق
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-clipboard-check text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">اختبر نفسك</h3>
                    <p className="text-gray-600 text-sm">
                      استخدم الاختبارات لقياس تقدمك وتحديد نقاط القوة والضعف
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

// مكون بطاقة الفصل
const ChapterCard = ({ chapter, index }) => {
  // ألوان متدرجة للفصول
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600'
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden card-hover group">
      {/* رأس البطاقة */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
              الفصل {chapter.id}
            </span>
            <i className="fas fa-book text-2xl opacity-75"></i>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
          <p className="text-white text-opacity-90 english-text text-sm">
            {chapter.title_en}
          </p>
        </div>
        
        {/* تأثير زخرفي في الخلفية */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
          <i className="fas fa-graduation-cap text-6xl"></i>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-6">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {chapter.description}
        </p>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {chapter.lessonsCount}
            </div>
            <div className="text-sm text-gray-600">درس</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {chapter.totalWords}
            </div>
            <div className="text-sm text-gray-600">كلمة</div>
          </div>
        </div>

        {/* مؤشر الصعوبة */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">مستوى الصعوبة:</span>
            <span className="text-sm font-semibold text-gray-800">
              {chapter.id <= 1 ? 'مبتدئ' : chapter.id <= 2 ? 'متوسط' : 'متقدم'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                chapter.id <= 1 ? 'bg-green-500' : 
                chapter.id <= 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(chapter.id * 33, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* أزرار العمل */}
        <div className="space-y-3">
          <Link
            to={`/chapters/${chapter.id}/lessons`}
            className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg
                       hover:bg-blue-600 transition-colors btn-press font-semibold
                       group-hover:bg-blue-600"
          >
            <i className="fas fa-play ml-2"></i>
            ابدأ الدروس
          </Link>
          
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/chapters/${chapter.id}/practice`}
              className="block bg-green-500 text-white text-center py-2 rounded-lg
                         hover:bg-green-600 transition-colors btn-press text-sm font-medium"
            >
              <i className="fas fa-clone ml-1"></i>
              بطاقات
            </Link>
            
            <Link
              to={`/chapters/${chapter.id}/quiz`}
              className="block bg-purple-500 text-white text-center py-2 rounded-lg
                         hover:bg-purple-600 transition-colors btn-press text-sm font-medium"
            >
              <i className="fas fa-quiz ml-1"></i>
              اختبار
            </Link>
          </div>
        </div>
      </div>

      {/* شريط التقدم (يمكن إضافته لاحقاً لتتبع تقدم المستخدم) */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>التقدم:</span>
          <span>0% مكتمل</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;