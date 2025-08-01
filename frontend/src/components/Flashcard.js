// مكون البطاقة التعليمية - Flashcard Component
// يعرض الكلمة مع إمكانية التبديل بين الكلمة والترجمة + ميزة النطق

import React, { useState } from 'react';

// مكون البطاقة التعليمية الرئيسي
const Flashcard = ({ word, showControls = true, className = '' }) => {
  // حالة لتتبع وجه البطاقة المعروض (أمامي/خلفي)
  const [isFlipped, setIsFlipped] = useState(false);
  
  // حالة لتتبع حالة تشغيل الصوت
  const [isSpeaking, setIsSpeaking] = useState(false);

  // وظيفة تبديل وجه البطاقة
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // وظيفة تشغيل النطق باستخدام Web Speech API
  const speakText = (text, language = 'en-US') => {
    // التحقق من دعم المتصفح لميزة النطق
    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم ميزة النطق الصوتي');
      return;
    }

    // إيقاف أي نطق جاري
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);

    // إنشاء كائن النطق
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8; // سرعة النطق
    utterance.pitch = 1; // نبرة الصوت
    utterance.volume = 1; // مستوى الصوت

    // مراقبة انتهاء النطق
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // مراقبة حدوث خطأ
    utterance.onerror = (event) => {
      console.error('خطأ في النطق:', event.error);
      setIsSpeaking(false);
    };

    // تشغيل النطق
    window.speechSynthesis.speak(utterance);
  };

  // عدم عرض البطاقة إذا لم تكن البيانات متوفرة
  if (!word) {
    return (
      <div className="bg-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <div className={`flashcard-container ${className}`}>
      {/* البطاقة الرئيسية */}
      <div
        className={`
          relative w-full h-64 cursor-pointer perspective-1000
          transition-transform duration-500 preserve-3d card-hover
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        onClick={flipCard}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* الوجه الأمامي (الكلمة الإنجليزية) */}
        <div
          className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-blue-500 to-blue-600
            rounded-lg shadow-lg flex flex-col justify-center items-center
            text-white p-6
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 english-text">
              {word.english}
            </h2>
            <p className="text-blue-100 text-sm">
              اضغط للعرض الترجمة
            </p>
          </div>
          
          {/* أيقونة الصوت للوجه الأمامي */}
          <button
            className="absolute top-4 left-4 text-white hover:text-blue-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // منع تحريك البطاقة
              speakText(word.english, 'en-US');
            }}
            disabled={isSpeaking}
            title="استمع للنطق الإنجليزي"
          >
            <i className={`fas ${isSpeaking ? 'fa-volume-up fa-bounce' : 'fa-volume-up'} text-xl`}></i>
          </button>
        </div>

        {/* الوجه الخلفي (الترجمة العربية) */}
        <div
          className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br from-green-500 to-green-600
            rounded-lg shadow-lg flex flex-col justify-center items-center
            text-white p-6 rotate-y-180
            ${!isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)'
          }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {word.arabic}
            </h2>
            <p className="text-green-100 text-sm">
              اضغط للعودة للكلمة الإنجليزية
            </p>
          </div>

          {/* أيقونة الصوت للوجه الخلفي */}
          <button
            className="absolute top-4 left-4 text-white hover:text-green-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // منع تحريك البطاقة
              speakText(word.arabic, 'ar-SA');
            }}
            disabled={isSpeaking}
            title="استمع للنطق العربي"
          >
            <i className={`fas ${isSpeaking ? 'fa-volume-up fa-bounce' : 'fa-volume-up'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* معلومات إضافية تحت البطاقة */}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        {/* الجملة المثال */}
        <div className="mb-3">
          <h4 className="font-semibold text-gray-700 mb-2">
            <i className="fas fa-quote-left text-blue-500 ml-2"></i>
            جملة مثال:
          </h4>
          <div className="bg-gray-50 rounded p-3">
            <p className="english-text text-gray-800 mb-1">
              "{word.example_en}"
            </p>
            <p className="text-gray-600">
              "{word.example_ar}"
            </p>
          </div>
        </div>

        {/* أزرار التحكم (إذا كانت مطلوبة) */}
        {showControls && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => speakText(word.example_en, 'en-US')}
              disabled={isSpeaking}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors btn-press text-sm flex items-center gap-2"
              title="استمع للجملة الإنجليزية"
            >
              <i className="fas fa-play text-xs"></i>
              English
            </button>
            
            <button
              onClick={() => speakText(word.example_ar, 'ar-SA')}
              disabled={isSpeaking}
              className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                         transition-colors btn-press text-sm flex items-center gap-2"
              title="استمع للجملة العربية"
            >
              <i className="fas fa-play text-xs"></i>
              عربي
            </button>
            
            <button
              onClick={flipCard}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                         transition-colors btn-press text-sm flex items-center gap-2"
              title="اقلب البطاقة"
            >
              <i className="fas fa-sync-alt text-xs"></i>
              اقلب
            </button>
          </div>
        )}
      </div>

      {/* إضافة الأنماط المطلوبة للتأثير ثلاثي الأبعاد */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .fa-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};

// مكون مجموعة البطاقات - لعرض عدة بطاقات متتالية
export const FlashcardSet = ({ words, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // وظائف التنقل
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const goToCard = (index) => {
    setCurrentIndex(index);
  };

  if (!words || words.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">لا توجد كلمات متاحة</p>
      </div>
    );
  }

  return (
    <div className="flashcard-set max-w-2xl mx-auto">
      {/* عنوان المجموعة */}
      {title && (
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h2>
      )}

      {/* مؤشر التقدم */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            البطاقة {currentIndex + 1} من {words.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentIndex + 1) / words.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* البطاقة الحالية */}
      <Flashcard word={words[currentIndex]} showControls={true} />

      {/* أزرار التنقل */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevCard}
          disabled={words.length <= 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-press
                     flex items-center gap-2"
        >
          <i className="fas fa-chevron-right"></i>
          السابق
        </button>

        {/* نقاط التنقل */}
        <div className="flex gap-2">
          {words.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={`انتقل للبطاقة ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          disabled={words.length <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-press
                     flex items-center gap-2"
        >
          التالي
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      {/* معلومات سريعة */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>💡 اضغط على البطاقة للتبديل بين الكلمة والترجمة</p>
        <p>🔊 اضغط على أيقونة الصوت للاستماع للنطق</p>
      </div>
    </div>
  );
};

export default Flashcard;