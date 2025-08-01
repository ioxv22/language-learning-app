// ===================================
// Header Component - مكون الشريط العلوي
// يحتوي على التنقل الرئيسي والبحث
// ===================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { searchAPI } from '../services/api';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // التحقق من الصفحة النشطة
  const isActivePage = (path) => {
    return location.pathname === path;
  };

  // إظهار زر الأدمن بالنقر المضاعف على الشعار
  const handleLogoDoubleClick = () => {
    setShowAdminButton(true);
    setTimeout(() => setShowAdminButton(false), 15000); // يختفي بعد 15 ثانية
  };

  // وظيفة البحث
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchAPI.search(searchQuery.trim());
      setSearchResults(response.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // إغلاق نتائج البحث
  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // التنقل إلى صفحة النتيجة
  const navigateToResult = (result) => {
    if (result.type === 'paragraph') {
      navigate(`/lessons/${result.lessonId}?paragraph=${result.id}`);
    } else if (result.type === 'keyword') {
      navigate(`/lessons/${result.lessonId}?paragraph=${result.paragraphId}&highlight=${result.word}`);
    }
    closeSearchResults();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* الشعار والعنوان */}
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            onDoubleClick={handleLogoDoubleClick}
          >
            <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">منصة تعليم اللغات</h1>
              <p className="text-xs text-gray-500 english-text">Language Learning Platform</p>
            </div>
          </Link>

          {/* شريط البحث - للشاشات الكبيرة */}
          <div className="hidden md:block flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المحتوى..."
                className="input pl-12 pr-4"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                {isSearching ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-search"></i>
                )}
              </button>
              
              {/* إغلاق البحث */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={closeSearchResults}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </form>

            {/* نتائج البحث */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults && searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-sm text-gray-500 p-2 border-b">
                      {searchResults.length} نتيجة للبحث "{searchQuery}"
                    </div>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => navigateToResult(result)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            result.type === 'paragraph' 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'bg-success-100 text-success-600'
                          }`}>
                            <i className={`fas ${result.type === 'paragraph' ? 'fa-paragraph' : 'fa-language'}`}></i>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {result.type === 'paragraph' ? result.title : result.word}
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.type === 'paragraph' ? result.content : result.translation}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {result.courseTitle} ← {result.lessonTitle}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <i className="fas fa-search text-2xl mb-2"></i>
                    <div>لا توجد نتائج للبحث "{searchQuery}"</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* التنقل الرئيسي - للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`nav-link ${isActivePage('/') ? 'active' : ''}`}
            >
              <i className="fas fa-home text-sm"></i>
              الرئيسية
            </Link>
            
            <Link
              to="/courses"
              className={`nav-link ${isActivePage('/courses') ? 'active' : ''}`}
            >
              <i className="fas fa-book text-sm"></i>
              الكورسات
            </Link>
            
            <Link
              to="/chapters"
              className={`nav-link ${isActivePage('/chapters') ? 'active' : ''}`}
            >
              <i className="fas fa-list text-sm"></i>
              جميع الدروس
            </Link>
            
            <Link
              to="/review"
              className={`nav-link ${isActivePage('/review') ? 'active' : ''}`}
            >
              <i className="fas fa-book-reader text-sm"></i>
              المراجعة
            </Link>
            
            <Link
              to="/progress"
              className={`nav-link ${isActivePage('/progress') ? 'active' : ''}`}
            >
              <i className="fas fa-chart-line text-sm"></i>
              التقدم
            </Link>

            {/* زر الأدمن المخفي */}
            {showAdminButton && (
              <Link
                to="/admin-hk102573-secure"
                className="nav-link bg-gradient-to-r from-red-500 to-purple-600 text-white hover:from-red-600 hover:to-purple-700 shadow-lg animate-pulse"
                onClick={() => setShowAdminButton(false)}
              >
                <i className="fas fa-shield-alt text-sm"></i>
                أدمن
              </Link>
            )}
          </nav>

          {/* زر القائمة - للشاشات الصغيرة */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* القائمة المنسدلة للشاشات الصغيرة */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-slide-up">
            
            {/* شريط البحث للموبايل */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المحتوى..."
                  className="input pl-12 pr-4"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
                >
                  {isSearching ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-search"></i>
                  )}
                </button>
              </div>
            </form>

            {/* روابط التنقل للموبايل */}
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link block ${isActivePage('/') ? 'active' : ''}`}
              >
                <i className="fas fa-home ml-3"></i>
                الرئيسية
              </Link>
              
              <Link
                to="/courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link block ${isActivePage('/courses') ? 'active' : ''}`}
              >
                <i className="fas fa-book ml-3"></i>
                الكورسات
              </Link>
              
              <Link
                to="/chapters"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link block ${isActivePage('/chapters') ? 'active' : ''}`}
              >
                <i className="fas fa-list ml-3"></i>
                جميع الدروس
              </Link>
              
              <Link
                to="/review"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link block ${isActivePage('/review') ? 'active' : ''}`}
              >
                <i className="fas fa-book-reader ml-3"></i>
                المراجعة
              </Link>
              
              <Link
                to="/progress"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link block ${isActivePage('/progress') ? 'active' : ''}`}
              >
                <i className="fas fa-chart-line ml-3"></i>
                التقدم
              </Link>
            </nav>
          </div>
        )}
      </div>
      
      {/* خلفية شفافة لإغلاق نتائج البحث */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeSearchResults}
        ></div>
      )}
    </header>
  );
};

// مكون شريط الإحصائيات
export const StatsBar = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="gradient-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-book-open"></i>
            <span><strong>{stats.totalCourses}</strong> كورس</span>
          </div>
          
          <div className="flex items-center gap-2">
            <i className="fas fa-list"></i>
            <span><strong>{stats.totalLessons}</strong> درس</span>
          </div>
          
          <div className="flex items-center gap-2">
            <i className="fas fa-paragraph"></i>
            <span><strong>{stats.totalParagraphs}</strong> فقرة</span>
          </div>
          
          <div className="flex items-center gap-2">
            <i className="fas fa-question-circle"></i>
            <span><strong>{stats.totalQuizzes}</strong> سؤال</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون شريط الإشعارات
export const NotificationBar = ({ message, type = 'info', onClose, onRetry }) => {
  if (!message) return null;

  const typeStyles = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-danger'
  };

  const typeIcons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
  };

  return (
    <div className={`alert ${typeStyles[type]} animate-slide-up`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className={`fas ${typeIcons[type]}`}></i>
            <span className="font-medium">{message}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* زر إعادة المحاولة للأخطاء */}
            {type === 'error' && onRetry && (
              <button
                onClick={onRetry}
                className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all"
              >
                <i className="fas fa-redo text-xs ml-1"></i>
                إعادة المحاولة
              </button>
            )}
            
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;