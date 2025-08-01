// ===================================
// App Component - التطبيق الرئيسي
// يحتوي على التوجيه الرئيسي وإعداد التطبيق
// ===================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header, { StatsBar, NotificationBar } from './components/Header';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ChaptersPage from './pages/ChaptersPage';
import ReviewPage from './pages/ReviewPage';
import SearchPage from './pages/SearchPage';
import ProgressPage from './pages/ProgressPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LessonPage from './pages/LessonPage';
import { statsAPI } from './services/api';

function App() {
  // الحالات العامة للتطبيق
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showAdminButton, setShowAdminButton] = useState(false);

  // جلب الإحصائيات العامة عند تحميل التطبيق
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🔄 محاولة جلب الإحصائيات...');
        const response = await statsAPI.getGeneral();
        console.log('✅ تم جلب الإحصائيات بنجاح:', response);
        setStats(response.data);
        setIsOnline(true);
        
        // إخفاء أي رسائل خطأ سابقة
        if (notification && notification.type === 'error') {
          setNotification(null);
        }
      } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        setIsOnline(false);
        setNotification({
          message: 'تعذر الاتصال بالخادم. جاري إعادة المحاولة...',
          type: 'error',
          action: () => fetchStats()
        });
        
        // إعادة المحاولة بعد 5 ثوان
        setTimeout(() => {
          console.log('🔄 إعادة محاولة جلب الإحصائيات...');
          fetchStats();
        }, 5000);
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
      } else {
        // إعادة جلب الإحصائيات عند عودة الاتصال
        fetchStats();
      }
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // إغلاق الإشعار
  const closeNotification = () => {
    setNotification(null);
  };

  // إظهار زر الأدمن بالنقر المضاعف على الشعار
  const handleLogoDoubleClick = () => {
    setShowAdminButton(true);
    setTimeout(() => setShowAdminButton(false), 10000); // يختفي بعد 10 ثوان
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        
        {/* الشريط العلوي */}
        <Header />
        
        {/* شريط الإحصائيات */}
        {stats && <StatsBar stats={stats} />}
        
        {/* شريط الإشعارات */}
        {notification && (
          <NotificationBar 
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
            onRetry={notification.action}
          />
        )}

        {/* المحتوى الرئيسي */}
        <main className="flex-1">
          <Routes>
            {/* الصفحة الرئيسية */}
            <Route path="/" element={<HomePage />} />
            
            {/* صفحة الكورسات */}
            <Route path="/courses" element={<CoursesPage />} />
            
            {/* صفحة كورس محدد */}
            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
            
            {/* صفحة جميع الدروس */}
            <Route path="/chapters" element={<ChaptersPage />} />
            
            {/* صفحة المراجعة */}
            <Route path="/review" element={<ReviewPage />} />
            
            {/* صفحة درس محدد */}
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            
            {/* صفحة البحث */}
            <Route path="/search" element={<SearchPage />} />
            
            {/* صفحة التقدم */}
            <Route path="/progress" element={<ProgressPage />} />
            
            {/* صفحة التواصل */}
            <Route path="/contact" element={<ContactPage />} />
            
            {/* صفحة الأدمن المخفية */}
            <Route path="/admin-hk102573-secure" element={<AdminPage />} />
            
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







// مكون صفحة 404
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="btn btn-primary"
          >
            <i className="fas fa-home mr-2"></i>
            العودة للرئيسية
          </a>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            <i className="fas fa-arrow-right mr-2"></i>
            الصفحة السابقة
          </button>
        </div>
      </div>
    </div>
  );
};

// مكون الفوتر
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* معلومات المنصة */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <h3 className="text-xl font-bold">منصة تعليم اللغات</h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              منصة تفاعلية لتعلم اللغة الإنجليزية بطريقة حديثة وممتعة مع فقرات تعليمية واختبارات ذكية
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-home text-sm"></i>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-book text-sm"></i>
                  الكورسات
                </a>
              </li>
              <li>
                <a href="/chapters" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-list text-sm"></i>
                  جميع الدروس
                </a>
              </li>
              <li>
                <a href="/review" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-book-reader text-sm"></i>
                  المراجعة
                </a>
              </li>
              <li>
                <a href="/progress" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-chart-line text-sm"></i>
                  التقدم
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <i className="fas fa-envelope text-sm"></i>
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* معلومات الاتصال */}
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-primary-400"></i>
                <span>hk102573@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-phone text-primary-400"></i>
                <span dir="ltr">+971 54 440 1266</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-map-marker-alt text-primary-400"></i>
                <span>أبوظبي، الإمارات العربية المتحدة</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-clock text-primary-400"></i>
                <span>الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 منصة تعليم اللغات. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-sm">
            تم التطوير بـ ❤️ باستخدام React.js و Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default App;