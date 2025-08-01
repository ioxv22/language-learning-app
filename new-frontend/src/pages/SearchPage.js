// ===================================
// SearchPage Component - صفحة البحث المتقدم
// تتيح البحث في جميع المحتوى التعليمي
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchAPI, speechAPI } from '../services/api';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // البحث
  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await searchAPI.search(query.trim());
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // البحث التلقائي عند تغيير النص
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // فلترة النتائج
  const filteredResults = searchResults.filter(result => {
    if (filterType === 'all') return true;
    return result.type === filterType;
  });

  // ترتيب النتائج
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return (b.relevance || 0) - (a.relevance || 0);
      case 'course':
        return a.courseTitle.localeCompare(b.courseTitle);
      case 'lesson':
        return a.lessonTitle.localeCompare(b.lessonTitle);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  // التنقل إلى النتيجة
  const navigateToResult = (result) => {
    if (result.type === 'paragraph') {
      window.open(`/lessons/${result.lessonId}?paragraph=${result.id}`, '_blank');
    } else if (result.type === 'keyword') {
      window.open(`/lessons/${result.lessonId}?paragraph=${result.paragraphId}&highlight=${result.word}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="fas fa-search text-primary-600 ml-3"></i>
              البحث في المحتوى التعليمي
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ابحث في جميع الفقرات والكلمات والدروس للعثور على ما تريد تعلمه
            </p>
          </div>

          {/* شريط البحث الرئيسي */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ابحث في الفقرات والكلمات والدروس..."
                className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-0 transition-colors"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading || !searchQuery.trim()}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 btn btn-primary px-6 disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-search"></i>
                )}
              </button>
            </div>

            {/* أمثلة البحث */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 ml-2">أمثلة:</span>
              {['hello', 'grammar', 'present tense', 'مرحبا'].map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(example);
                    handleSearch(example);
                  }}
                  className="mx-1 px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 hover:text-primary-600 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* أدوات الفلترة والترتيب */}
        {hasSearched && (
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">عرض:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input text-sm py-2"
                >
                  <option value="all">جميع النتائج ({filteredResults.length})</option>
                  <option value="paragraph">الفقرات ({searchResults.filter(r => r.type === 'paragraph').length})</option>
                  <option value="keyword">الكلمات ({searchResults.filter(r => r.type === 'keyword').length})</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">ترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input text-sm py-2"
                >
                  <option value="relevance">الأكثر صلة</option>
                  <option value="course">حسب الكورس</option>
                  <option value="lesson">حسب الدرس</option>
                  <option value="type">حسب النوع</option>
                </select>
              </div>
            </div>

            {/* إحصائيات النتائج */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-600">{sortedResults.length}</div>
                <div className="text-sm text-primary-700">نتيجة إجمالية</div>
              </div>
              <div className="bg-success-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-success-600">
                  {searchResults.filter(r => r.type === 'paragraph').length}
                </div>
                <div className="text-sm text-success-700">فقرة</div>
              </div>
              <div className="bg-warning-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-warning-600">
                  {searchResults.filter(r => r.type === 'keyword').length}
                </div>
                <div className="text-sm text-warning-700">كلمة</div>
              </div>
            </div>
          </div>
        )}

        {/* النتائج */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري البحث...</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">ابدأ البحث</h2>
            <p className="text-gray-500 mb-8">اكتب كلمة أو جملة في شريط البحث أعلاه</p>
            
            {/* نصائح البحث */}
            <div className="max-w-2xl mx-auto">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">نصائح للبحث الفعال:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <i className="fas fa-lightbulb text-warning-500 mt-1"></i>
                    <div>
                      <div className="font-medium mb-1">البحث بالكلمات المفردة</div>
                      <div>جرب "hello" أو "grammar"</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fas fa-quote-left text-primary-500 mt-1"></i>
                    <div>
                      <div className="font-medium mb-1">البحث بالجمل</div>
                      <div>جرب "present tense" أو "how are you"</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fas fa-language text-success-500 mt-1"></i>
                    <div>
                      <div className="font-medium mb-1">البحث بالعربية</div>
                      <div>جرب "مرحبا" أو "قواعد"</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fas fa-star text-purple-500 mt-1"></i>
                    <div>
                      <div className="font-medium mb-1">البحث المتقدم</div>
                      <div>استخدم أكثر من كلمة للبحث الدقيق</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-search-minus text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد نتائج</h2>
            <p className="text-gray-500 mb-8">لم نجد أي نتائج للبحث "{searchQuery}"</p>
            
            <div className="max-w-md mx-auto">
              <div className="alert alert-info text-sm">
                <i className="fas fa-info-circle ml-2"></i>
                جرب استخدام كلمات مختلفة أو أقل تحديداً في البحث
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-gray-800 mb-6">
              {sortedResults.length} نتيجة للبحث "{searchQuery}"
            </div>
            
            {sortedResults.map((result, index) => (
              <SearchResultCard
                key={`${result.type}-${result.id}-${index}`}
                result={result}
                searchQuery={searchQuery}
                onNavigate={() => navigateToResult(result)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// مكون بطاقة نتيجة البحث
const SearchResultCard = ({ result, searchQuery, onNavigate }) => {
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const typeConfig = {
    paragraph: {
      icon: 'fa-paragraph',
      color: 'primary',
      label: 'فقرة'
    },
    keyword: {
      icon: 'fa-language',
      color: 'success',
      label: 'كلمة'
    }
  };

  const config = typeConfig[result.type] || typeConfig.paragraph;

  return (
    <div className="card card-hover cursor-pointer" onClick={onNavigate}>
      <div className="flex items-start gap-4">
        
        {/* أيقونة النوع */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${config.color}-100 text-${config.color}-600 flex-shrink-0`}>
          <i className={`fas ${config.icon}`}></i>
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          
          {/* العنوان والنوع */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {result.type === 'paragraph' 
                ? highlightText(result.title, searchQuery)
                : highlightText(result.word, searchQuery)
              }
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-600`}>
              {config.label}
            </span>
          </div>

          {/* المحتوى */}
          <div className="text-gray-600 mb-3 line-clamp-2">
            {result.type === 'paragraph' ? (
              <div>
                {highlightText(result.content.substring(0, 200), searchQuery)}
                {result.content.length > 200 && '...'}
              </div>
            ) : (
              <div>
                <div className="english-text font-medium mb-1">
                  {highlightText(result.word, searchQuery)}
                </div>
                <div className="text-sm">
                  {highlightText(result.translation, searchQuery)}
                </div>
                {result.example && (
                  <div className="text-sm text-gray-500 mt-1 english-text">
                    "{result.example}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* معلومات المصدر */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className="fas fa-map-marker-alt"></i>
              <span>{result.courseTitle}</span>
              <i className="fas fa-chevron-left text-xs"></i>
              <span>{result.lessonTitle}</span>
            </div>

            {/* زر النطق للكلمات */}
            {result.type === 'keyword' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speechAPI.speakEnglish(result.word);
                }}
                className="speak-btn"
                title="استمع للنطق"
              >
                <i className="fas fa-volume-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* سهم الانتقال */}
        <div className="flex-shrink-0">
          <i className="fas fa-external-link-alt text-gray-400 hover:text-primary-600 transition-colors"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;