// ===================================
// ReviewPage Component - صفحة المراجعة
// تعرض جميع الكلمات المتعلمة للمراجعة
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, speechAPI, storageAPI } from '../services/api';

const ReviewPage = () => {
  const [allKeywords, setAllKeywords] = useState([]);
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالات الفلترة
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterLetter, setFilterLetter] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');
  
  // حالات العرض
  const [viewMode, setViewMode] = useState('cards'); // cards, list, quiz
  const [showMastered, setShowMastered] = useState(true);
  
  // حالات الاختبار
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const fetchAllKeywords = async () => {
      try {
        setLoading(true);
        
        const coursesResponse = await coursesAPI.getAll();
        const courses = coursesResponse.data || [];
        
        const allKeywordsData = [];
        
        for (const course of courses) {
          try {
            const lessonsResponse = await coursesAPI.getLessons(course.id);
            const lessons = lessonsResponse.data || [];
            
            for (const lesson of lessons) {
              // هنا يمكننا إضافة استدعاء للحصول على الفقرات
              // ولكن لتبسيط المثال سنستخدم بيانات وهمية
              const mockParagraphs = [
                {
                  keyWords: [
                    { word: 'hello', translation: 'مرحبا', pronunciation: '/həˈloʊ/', example: 'Hello, how are you?', exampleTranslation: 'مرحبا، كيف حالك؟' },
                    { word: 'world', translation: 'عالم', pronunciation: '/wɜːrld/', example: 'Welcome to the world', exampleTranslation: 'أهلا بك في العالم' }
                  ]
                }
              ];
              
              mockParagraphs.forEach(paragraph => {
                if (paragraph.keyWords) {
                  paragraph.keyWords.forEach(keyword => {
                    allKeywordsData.push({
                      ...keyword,
                      courseInfo: {
                        id: course.id,
                        title: course.title,
                        level: course.level
                      },
                      lessonInfo: {
                        id: lesson.id,
                        title: lesson.title
                      },
                      mastered: storageAPI.get(`word_mastered_${keyword.word}`, false),
                      reviewCount: storageAPI.get(`word_review_count_${keyword.word}`, 0),
                      lastReviewed: storageAPI.get(`word_last_reviewed_${keyword.word}`, null)
                    });
                  });
                }
              });
            }
          } catch (err) {
            console.error(`خطأ في جلب دروس الكورس ${course.id}:`, err);
          }
        }

        setAllKeywords(allKeywordsData);
        setError(null);
      } catch (err) {
        console.error('خطأ في جلب الكلمات:', err);
        setError(err.message);
        setAllKeywords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllKeywords();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = [...allKeywords];

    // فلتر البحث
    if (searchQuery) {
      filtered = filtered.filter(keyword => 
        keyword.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keyword.translation.includes(searchQuery)
      );
    }

    // فلتر الكورس
    if (filterCourse !== 'all') {
      filtered = filtered.filter(keyword => 
        keyword.courseInfo.id === parseInt(filterCourse)
      );
    }

    // فلتر الحرف الأول
    if (filterLetter !== 'all') {
      filtered = filtered.filter(keyword => 
        keyword.word.toLowerCase().startsWith(filterLetter.toLowerCase())
      );
    }

    // فلتر الكلمات المتقنة
    if (!showMastered) {
      filtered = filtered.filter(keyword => !keyword.mastered);
    }

    // الترتيب
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case 'course':
        filtered.sort((a, b) => a.courseInfo.title.localeCompare(b.courseInfo.title));
        break;
      case 'recent':
        filtered.sort((a, b) => (b.lastReviewed || 0) - (a.lastReviewed || 0));
        break;
      case 'difficulty':
        filtered.sort((a, b) => (a.reviewCount || 0) - (b.reviewCount || 0));
        break;
    }

    setFilteredKeywords(filtered);
  }, [allKeywords, searchQuery, filterCourse, filterLetter, sortBy, showMastered]);

  // بدء اختبار المراجعة
  const startQuizMode = () => {
    if (filteredKeywords.length === 0) return;
    
    setQuizMode(true);
    setCurrentQuizIndex(0);
    setQuizResults([]);
    setShowTranslation(false);
  };

  // الإجابة على سؤال الاختبار
  const answerQuiz = (isCorrect) => {
    const currentKeyword = filteredKeywords[currentQuizIndex];
    
    setQuizResults([...quizResults, {
      keyword: currentKeyword,
      correct: isCorrect
    }]);

    // تحديث إحصائيات الكلمة
    const newReviewCount = (currentKeyword.reviewCount || 0) + 1;
    storageAPI.set(`word_review_count_${currentKeyword.word}`, newReviewCount);
    storageAPI.set(`word_last_reviewed_${currentKeyword.word}`, Date.now());
    
    if (isCorrect) {
      storageAPI.set(`word_mastered_${currentKeyword.word}`, true);
    }

    // الانتقال للسؤال التالي
    if (currentQuizIndex < filteredKeywords.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowTranslation(false);
    } else {
      // انتهاء الاختبار
      setQuizMode(false);
    }
  };

  // تشغيل النطق
  const playAudio = (word) => {
    speechAPI.speakEnglish(word);
  };

  // وضع علامة على الكلمة كمتقنة
  const toggleMastered = (word) => {
    const currentStatus = storageAPI.get(`word_mastered_${word}`, false);
    storageAPI.set(`word_mastered_${word}`, !currentStatus);
    
    // تحديث الحالة المحلية
    setAllKeywords(prev => prev.map(keyword => 
      keyword.word === word 
        ? { ...keyword, mastered: !currentStatus }
        : keyword
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الكلمات المتعلمة...</p>
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

  // وضع الاختبار
  if (quizMode && filteredKeywords.length > 0) {
    return <QuizMode 
      keyword={filteredKeywords[currentQuizIndex]}
      currentIndex={currentQuizIndex}
      total={filteredKeywords.length}
      showTranslation={showTranslation}
      onShowTranslation={() => setShowTranslation(true)}
      onAnswer={answerQuiz}
      onExit={() => setQuizMode(false)}
      results={quizResults}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="fas fa-book-reader text-primary-600 ml-3"></i>
              صفحة المراجعة
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              راجع جميع الكلمات التي تعلمتها واختبر نفسك لتثبيت المعلومات
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* إحصائيات */}
        <div className="card mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {allKeywords.length}
              </div>
              <div className="text-gray-600">كلمة إجمالي</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-600 mb-2">
                {allKeywords.filter(k => k.mastered).length}
              </div>
              <div className="text-gray-600">كلمة متقنة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {allKeywords.filter(k => !k.mastered).length}
              </div>
              <div className="text-gray-600">تحتاج مراجعة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {filteredKeywords.length}
              </div>
              <div className="text-gray-600">كلمة مفلترة</div>
            </div>
          </div>
        </div>

        {/* أدوات التحكم */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">أدوات المراجعة:</h2>
            
            <div className="flex gap-2">
              <button
                onClick={startQuizMode}
                disabled={filteredKeywords.length === 0}
                className="btn btn-primary disabled:opacity-50"
              >
                <i className="fas fa-brain mr-2"></i>
                اختبار المراجعة ({filteredKeywords.length})
              </button>
            </div>
          </div>

          {/* البحث والفلاتر */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            
            {/* البحث */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الكلمات..."
                className="input pl-10 pr-4"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* فلتر الكورس */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="input"
            >
              <option value="all">جميع الكورسات</option>
              {[...new Set(allKeywords.map(k => k.courseInfo.id))].map(courseId => {
                const course = allKeywords.find(k => k.courseInfo.id === courseId)?.courseInfo;
                return (
                  <option key={courseId} value={courseId}>
                    {course?.title}
                  </option>
                );
              })}
            </select>

            {/* فلتر الحرف */}
            <select
              value={filterLetter}
              onChange={(e) => setFilterLetter(e.target.value)}
              className="input"
            >
              <option value="all">جميع الحروف</option>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                <option key={letter} value={letter}>{letter}</option>
              ))}
            </select>
          </div>

          {/* خيارات العرض والترتيب */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* نوع العرض */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">العرض:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <i className="fas fa-th-large mr-1"></i>
                  بطاقات
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <i className="fas fa-list mr-1"></i>
                  قائمة
                </button>
              </div>
            </div>

            {/* الترتيب */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm py-1"
              >
                <option value="alphabetical">أبجدي</option>
                <option value="course">حسب الكورس</option>
                <option value="recent">الأحدث</option>
                <option value="difficulty">الأصعب</option>
              </select>
            </div>

            {/* إظهار المتقنة */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMastered}
                onChange={(e) => setShowMastered(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">إظهار الكلمات المتقنة</span>
            </label>
          </div>
        </div>

        {/* عرض الكلمات */}
        {filteredKeywords.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">لا توجد كلمات</h2>
            <p className="text-gray-500">
              {allKeywords.length === 0 
                ? 'لم تتعلم أي كلمات بعد. ابدأ بدراسة الدروس لإضافة كلمات هنا.'
                : 'لا توجد كلمات تتطابق مع الفلاتر المحددة'
              }
            </p>
            {allKeywords.length === 0 && (
              <Link to="/courses" className="btn btn-primary mt-4">
                ابدأ التعلم
              </Link>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKeywords.map((keyword, index) => (
                  <KeywordCard 
                    key={`${keyword.word}-${index}`} 
                    keyword={keyword}
                    onToggleMastered={toggleMastered}
                    onPlayAudio={playAudio}
                  />
                ))}
              </div>
            ) : (
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-3 px-4 font-semibold">الكلمة</th>
                        <th className="text-right py-3 px-4 font-semibold">الترجمة</th>
                        <th className="text-right py-3 px-4 font-semibold">الكورس</th>
                        <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKeywords.map((keyword, index) => (
                        <tr key={`${keyword.word}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="english-text font-semibold text-primary-700">
                              {keyword.word}
                            </div>
                            {keyword.pronunciation && (
                              <div className="text-sm text-gray-500 english-text">
                                {keyword.pronunciation}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {keyword.translation}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <div className="font-medium">{keyword.courseInfo.title}</div>
                              <div className="text-gray-500">{keyword.lessonInfo.title}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {keyword.mastered ? (
                              <span className="bg-success-100 text-success-600 px-2 py-1 rounded-full text-xs font-semibold">
                                <i className="fas fa-check mr-1"></i>
                                متقن
                              </span>
                            ) : (
                              <span className="bg-warning-100 text-warning-600 px-2 py-1 rounded-full text-xs font-semibold">
                                <i className="fas fa-clock mr-1"></i>
                                يحتاج مراجعة
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => playAudio(keyword.word)}
                                className="text-primary-600 hover:text-primary-700 p-1"
                                title="استمع"
                              >
                                <i className="fas fa-volume-up"></i>
                              </button>
                              <button
                                onClick={() => toggleMastered(keyword.word)}
                                className={`p-1 ${
                                  keyword.mastered 
                                    ? 'text-success-600 hover:text-success-700' 
                                    : 'text-gray-400 hover:text-success-600'
                                }`}
                                title={keyword.mastered ? 'إلغاء الإتقان' : 'وضع علامة متقن'}
                              >
                                <i className={`fas ${keyword.mastered ? 'fa-star' : 'fa-star'}`}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// مكون بطاقة الكلمة
const KeywordCard = ({ keyword, onToggleMastered, onPlayAudio }) => {
  return (
    <div className={`card transition-all duration-200 ${
      keyword.mastered ? 'border-l-4 border-success-500' : 'hover:shadow-lg'
    }`}>
      
      {/* رأس البطاقة */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="english-text text-xl font-bold text-primary-700 mb-1">
            {keyword.word}
          </div>
          {keyword.pronunciation && (
            <div className="english-text text-sm text-gray-500 mb-2">
              {keyword.pronunciation}
            </div>
          )}
          <div className="text-lg text-gray-800 font-semibold">
            {keyword.translation}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onPlayAudio(keyword.word)}
            className="speak-btn"
            title="استمع للنطق"
          >
            <i className="fas fa-volume-up"></i>
          </button>
          <button
            onClick={() => onToggleMastered(keyword.word)}
            className={`p-2 rounded-lg transition-colors ${
              keyword.mastered 
                ? 'text-success-600 bg-success-50 hover:bg-success-100' 
                : 'text-gray-400 hover:text-success-600 hover:bg-success-50'
            }`}
            title={keyword.mastered ? 'إلغاء الإتقان' : 'وضع علامة متقن'}
          >
            <i className={`fas fa-star`}></i>
          </button>
        </div>
      </div>

      {/* المثال */}
      {keyword.example && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="english-text text-sm text-gray-700 mb-1">
            "{keyword.example}"
          </div>
          <div className="text-sm text-gray-600">
            "{keyword.exampleTranslation}"
          </div>
        </div>
      )}

      {/* معلومات الكورس */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium text-gray-700">{keyword.courseInfo.title}</div>
            <div className="text-gray-500">{keyword.lessonInfo.title}</div>
          </div>
          
          {keyword.mastered && (
            <span className="bg-success-100 text-success-600 px-2 py-1 rounded-full text-xs font-semibold">
              <i className="fas fa-trophy mr-1"></i>
              متقن
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// مكون وضع الاختبار
const QuizMode = ({ keyword, currentIndex, total, showTranslation, onShowTranslation, onAnswer, onExit, results }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        
        {/* شريط التقدم */}
        <div className="bg-white bg-opacity-20 rounded-full p-2 mb-8">
          <div className="flex items-center justify-between text-white mb-2">
            <span>السؤال {currentIndex + 1} من {total}</span>
            <button onClick={onExit} className="hover:text-red-200">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="progress-bar bg-white bg-opacity-30">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* السؤال */}
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ما معنى هذه الكلمة؟
          </h2>

          <div className="bg-primary-50 rounded-lg p-8 mb-6">
            <div className="english-text text-4xl font-bold text-primary-700 mb-4">
              {keyword.word}
            </div>
            
            {keyword.pronunciation && (
              <div className="english-text text-lg text-gray-600 mb-4">
                {keyword.pronunciation}
              </div>
            )}

            <button
              onClick={() => speechAPI.speakEnglish(keyword.word)}
              className="btn btn-primary"
            >
              <i className="fas fa-volume-up mr-2"></i>
              استمع للنطق
            </button>
          </div>

          {!showTranslation ? (
            <div className="space-y-4">
              <button
                onClick={onShowTranslation}
                className="btn btn-outline w-full py-4 text-lg"
              >
                <i className="fas fa-eye mr-2"></i>
                إظهار المعنى
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-success-50 rounded-lg p-6">
                <div className="text-2xl font-bold text-success-700 mb-2">
                  {keyword.translation}
                </div>
                
                {keyword.example && (
                  <div className="text-sm text-gray-600">
                    <div className="english-text mb-1">"{keyword.example}"</div>
                    <div>"{keyword.exampleTranslation}"</div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => onAnswer(true)}
                  className="btn btn-success flex-1 py-4 text-lg"
                >
                  <i className="fas fa-check mr-2"></i>
                  أعرف المعنى
                </button>
                
                <button
                  onClick={() => onAnswer(false)}
                  className="btn btn-danger flex-1 py-4 text-lg"
                >
                  <i className="fas fa-times mr-2"></i>
                  لا أعرف
                </button>
              </div>
            </div>
          )}
        </div>

        {/* النتائج */}
        {results.length > 0 && (
          <div className="mt-6 text-center text-white">
            <div className="text-sm opacity-75 mb-2">النتائج الحالية:</div>
            <div className="flex justify-center gap-4">
              <span className="bg-success-500 bg-opacity-50 px-3 py-1 rounded-full">
                <i className="fas fa-check mr-1"></i>
                {results.filter(r => r.correct).length}
              </span>
              <span className="bg-danger-500 bg-opacity-50 px-3 py-1 rounded-full">
                <i className="fas fa-times mr-1"></i>
                {results.filter(r => !r.correct).length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;