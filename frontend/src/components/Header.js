// مكون الشريط العلوي - Header Component
// يحتوي على شعار الموقع والتنقل الرئيسي وشريط البحث

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // وظيفة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch?.(searchTerm.trim());
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // تحديد الصفحة النشطة للتنقل
  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* الشعار والعنوان */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">تعلم اللغات</h1>
              <p className="text-xs text-gray-500">Learn Languages</p>
            </div>
          </Link>

          {/* شريط البحث - للشاشات الكبيرة */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن كلمة..."
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2
                           text-gray-400 hover:text-blue-500 transition-colors"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* التنقل الرئيسي - للشاشات الكبيرة */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isActivePage('/') 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-home text-sm"></i>
              الرئيسية
            </Link>
            
            <Link
              to="/chapters"
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isActivePage('/chapters') 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-book text-sm"></i>
              الفصول
            </Link>
            
            <Link
              to="/lessons"
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isActivePage('/lessons') 
                  ? 'bg-blue-100 text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-list text-sm"></i>
              الدروس
            </Link>
            
            <Link
              to="/practice"
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isActivePage('/practice') 
                  ? 'bg-green-100 text-green-600 font-semibold' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <i className="fas fa-brain text-sm"></i>
              المراجعة
            </Link>
          </nav>

          {/* زر القائمة - للشاشات الصغيرة */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* القائمة المنسدلة للشاشات الصغيرة */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* شريط البحث للموبايل */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن كلمة..."
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2
                             text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            {/* روابط التنقل للموبايل */}
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActivePage('/') 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <i className="fas fa-home ml-3"></i>
                الرئيسية
              </Link>
              
              <Link
                to="/chapters"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActivePage('/chapters') 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <i className="fas fa-book ml-3"></i>
                الفصول
              </Link>
              
              <Link
                to="/lessons"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActivePage('/lessons') 
                    ? 'bg-blue-100 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <i className="fas fa-list ml-3"></i>
                الدروس
              </Link>
              
              <Link
                to="/practice"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActivePage('/practice') 
                    ? 'bg-green-100 text-green-600 font-semibold' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <i className="fas fa-brain ml-3"></i>
                المراجعة
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// مكون شريط الإحصائيات السريعة (اختياري)
export const StatsBar = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <i className="fas fa-book-open"></i>
            <span><strong>{stats.totalChapters}</strong> فصول</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <i className="fas fa-list"></i>
            <span><strong>{stats.totalLessons}</strong> درس</span>
          </div>
          
          <div className="flex items-center gap-2 text-purple-600">
            <i className="fas fa-language"></i>
            <span><strong>{stats.totalWords}</strong> كلمة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون شريط الإشعارات (للرسائل المهمة)
export const NotificationBar = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const typeStyles = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
  };

  const typeIcons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
  };

  return (
    <div className={`border-b ${typeStyles[type]}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className={`fas ${typeIcons[type]}`}></i>
            <span className="text-sm font-medium">{message}</span>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;