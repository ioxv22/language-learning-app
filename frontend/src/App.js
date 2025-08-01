// التطبيق الرئيسي - Main App Component
// يحتوي على التوجيه الرئيسي وإعداد التطبيق

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header, { StatsBar, NotificationBar } from './components/Header';
import HomePage from './pages/HomePage';
import ChaptersPage from './pages/ChaptersPage';
import LessonPage from './pages/LessonPage';
import { apiService } from './services/api';

// مكون التطبيق الرئيسي
function App() {
  // الحالات العامة للتطبيق
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [searchResults, setSearchResults] = useState(null);

  // جلب الإحصائيات العامة عند تحميل التطبيق
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
        setIsOnline(false);
        setNotification({
          message: 'تعذر الاتصال بالخادم. بعض الميزات قد لا تعمل بشكل صحيح.',
          type: 'error'
        });
      }
    };

    fetchStats();

    // فحص اتصال الإنترنت
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        setNotification({
          message: 'لا يوجد اتصال بالإنترنت. سيتم تحميل البيانات المحفوظة.',
          type: 'warning'
        });
      }
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // وظيفة البحث
  const handleSearch = async (searchTerm) => {
    try {
      setNotification({
        message: `جاري البحث عن "${searchTerm}"...`,
        type: 'info'
      });

      const response = await apiService.searchWords(searchTerm);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setNotification({
          message: `لم يتم العثور على نتائج للبحث "${searchTerm}"`,
          type: 'warning'
        });
      } else {
        setNotification({
          message: `تم العثور على ${response.data.length} نتيجة للبحث "${searchTerm}"`,
          type: 'success'
        });
      }

      // إخفاء الإشعار بعد 3 ثوان
      setTimeout(() => {
        setNotification(null);
      }, 3000);

    } catch (error) {
      console.error('خطأ في البحث:', error);
      setNotification({
        message: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.',
        type: 'error'
      });
    }
  };

  // إغلاق الإشعار
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        
        {/* الشريط العلوي */}
        <Header onSearch={handleSearch} />
        
        {/* شريط الإحصائيات */}
        {stats && <StatsBar stats={stats} />}
        
        {/* شريط الإشعارات */}
        {notification && (
          <NotificationBar 
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}

        {/* المحتوى الرئيسي */}
        <main className="flex-1">
          <Routes>
            {/* الصفحة الرئيسية */}
            <Route path="/" element={<HomePage />} />
            
            {/* صفحة الفصول */}
            <Route path="/chapters" element={<ChaptersPage />} />
            
            {/* صفحة فصل محدد */}
            <Route path="/chapters/:chapterId" element={<ChapterDetailsPage />} />
            
            {/* صفحة دروس فصل محدد */}
            <Route path="/chapters/:chapterId/lessons" element={<ChapterLessonsPage />} />
            
            {/* صفحة جميع الدروس */}
            <Route path="/lessons" element={<AllLessonsPage />} />
            
            {/* صفحة درس محدد */}
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            
            {/* صفحة البحث */}
            <Route path="/search" element={<SearchResultsPage searchResults={searchResults} />} />
            
            {/* صفحة المراجعة */}
            <Route path="/practice" element={<PracticePage />} />
            
            {/* صفحة الاختبار لفصل محدد */}
            <Route path="/chapters/:chapterId/quiz" element={<ChapterQuizPage />} />
            
            {/* صفحة البطاقات لفصل محدد */}
            <Route path="/chapters/:chapterId/practice" element={<ChapterPracticePage />} />
            
            {/* صفحة 404 - غير موجود */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* الفوتر */}
        <Footer />
      </div>
    </Router>
  );
}

// مكون تفاصيل الفصل
const ChapterDetailsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">تفاصيل الفصل</h1>
        <p className="text-gray-600">هذه الصفحة قيد التطوير...</p>
      </div>
    </div>
  );
};

// مكون دروس الفصل
const ChapterLessonsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">دروس الفصل</h1>
        <p className="text-gray-600">هذه الصفحة قيد التطوير...</p>
      </div>
    </div>
  );
};

// مكون جميع الدروس
const AllLessonsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">جميع الدروس</h1>
        <p className="text-gray-600">هذه الصفحة قيد التطوير...</p>
      </div>
    </div>
  );
};

// مكون نتائج البحث
const SearchResultsPage = ({ searchResults }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchTerm = searchParams.get('q');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          نتائج البحث
        </h1>
        {searchTerm && (
          <p className="text-gray-600">
            البحث عن: "<span className="font-semibold">{searchTerm}</span>"
          </p>
        )}
      </div>

      {searchResults ? (
        searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((word) => (
              <div key={word.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 english-text">{word.english}</h3>
                  <p className="text-lg text-gray-600">{word.arabic}</p>
                </div>
                
                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700 english-text mb-1">"{word.example_en}"</p>
                  <p className="text-sm text-gray-600">"{word.example_ar}"</p>
                </div>

                {word.lessonInfo && (
                  <div className="text-sm text-gray-500">
                    من درس: 
                    <span className="font-medium ml-1">{word.lessonInfo.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد نتائج</h2>
            <p className="text-gray-500">جرب البحث بكلمات أخرى أو تحقق من الإملاء</p>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">ابحث عن كلمة</h2>
          <p className="text-gray-500">استخدم شريط البحث في الأعلى للعثور على الكلمات</p>
        </div>
      )}
    </div>
  );
};

// مكون صفحة المراجعة
const PracticePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          <i className="fas fa-brain text-blue-500 ml-3"></i>
          صفحة المراجعة
        </h1>
        <p className="text-gray-600 mb-8">راجع جميع الكلمات التي تعلمتها</p>
        <div className="bg-blue-50 rounded-lg p-8">
          <i className="fas fa-construction text-4xl text-blue-500 mb-4"></i>
          <p className="text-blue-700">هذه الصفحة قيد التطوير وستكون متاحة قريباً</p>
        </div>
      </div>
    </div>
  );
};

// مكون اختبار الفصل
const ChapterQuizPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">اختبار الفصل</h1>
        <p className="text-gray-600">هذه الصفحة قيد التطوير...</p>
      </div>
    </div>
  );
};

// مكون بطاقات الفصل
const ChapterPracticePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">بطاقات الفصل</h1>
        <p className="text-gray-600">هذه الصفحة قيد التطوير...</p>
      </div>
    </div>
  );
};

// مكون صفحة 404
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <a
          href="/"
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors btn-press font-bold"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
};

// مكون الفوتر
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* معلومات الموقع */}
          <div>
            <h3 className="text-xl font-bold mb-4">موقع تعليم اللغات</h3>
            <p className="text-gray-400 mb-4">
              منصة تفاعلية لتعلم اللغة الإنجليزية بطريقة ممتعة وفعالة
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>

          {/* روابط مفيدة */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط مفيدة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/chapters" className="text-gray-400 hover:text-white transition-colors">
                  الفصول
                </a>
              </li>
              <li>
                <a href="/lessons" className="text-gray-400 hover:text-white transition-colors">
                  الدروس
                </a>
              </li>
              <li>
                <a href="/practice" className="text-gray-400 hover:text-white transition-colors">
                  المراجعة
                </a>
              </li>
            </ul>
          </div>

          {/* تواصل معنا */}
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-2 text-gray-400">
              <p>
                <i className="fas fa-envelope ml-2"></i>
                info@languagelearning.com
              </p>
              <p>
                <i className="fas fa-phone ml-2"></i>
                +966 50 123 4567
              </p>
              <p>
                <i className="fas fa-map-marker-alt ml-2"></i>
                الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 موقع تعليم اللغات. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-sm">
            تم التطوير بـ ❤️ باستخدام React و Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default App;