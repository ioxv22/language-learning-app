// مكون الاختبار التفاعلي - Quiz Component
// يقوم بإنشاء اختبار تفاعلي للكلمات مع تتبع النتائج

import React, { useState, useEffect, useCallback } from 'react';

// مكون السؤال الواحد
const QuizQuestion = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 ثانية لكل سؤال

  // عداد الوقت
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      // إذا انتهى الوقت، اختر إجابة خاطئة تلقائياً
      handleAnswerSelect(-1); // -1 يعني لم يتم الاختيار
    }
  }, [timeLeft, showResult]);

  // وظيفة اختيار الإجابة
  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return; // منع التغيير بعد الإجابة

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    // إرسال النتيجة بعد ثانيتين
    setTimeout(() => {
      const isCorrect = answerIndex === question.correctIndex;
      onAnswer(isCorrect, answerIndex, timeLeft);
    }, 2000);
  };

  // تشغيل الصوت للكلمة
  const speakWord = (text, language = 'en-US') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="quiz-question bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* رأس السؤال */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            السؤال {questionNumber} من {totalQuestions}
          </span>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            timeLeft > 10 ? 'bg-green-100 text-green-700' : 
            timeLeft > 5 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            ⏰ {timeLeft}s
          </div>
        </div>
        
        {/* شريط التقدم */}
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* السؤال */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question.type === 'englishToArabic' ? 
            'ما معنى هذه الكلمة؟' : 
            'ما الترجمة الإنجليزية لهذه الكلمة؟'
          }
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-center gap-4">
            <h3 className={`text-3xl font-bold ${
              question.type === 'englishToArabic' ? 'english-text' : ''
            }`}>
              {question.word}
            </h3>
            <button
              onClick={() => speakWord(
                question.word, 
                question.type === 'englishToArabic' ? 'en-US' : 'ar-SA'
              )}
              className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
              title="استمع للنطق"
            >
              <i className="fas fa-volume-up text-xl"></i>
            </button>
          </div>
        </div>

        {/* الجملة المثال (إشارة إضافية) */}
        {question.example && (
          <p className="text-gray-600 text-sm italic">
            مثال: "{question.example}"
          </p>
        )}
      </div>

      {/* خيارات الإجابة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map((option, index) => {
          let buttonClass = "p-4 rounded-lg border-2 transition-all duration-300 text-right cursor-pointer hover:shadow-md btn-press ";
          
          if (showResult) {
            if (index === question.correctIndex) {
              buttonClass += "bg-green-100 border-green-500 text-green-700"; // الإجابة الصحيحة
            } else if (index === selectedAnswer) {
              buttonClass += "bg-red-100 border-red-500 text-red-700"; // الإجابة المختارة الخاطئة
            } else {
              buttonClass += "bg-gray-100 border-gray-300 text-gray-500"; // باقي الخيارات
            }
          } else {
            buttonClass += selectedAnswer === index ? 
              "bg-blue-100 border-blue-500 text-blue-700" : 
              "bg-white border-gray-300 text-gray-700 hover:border-blue-300";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
                {showResult && index === question.correctIndex && (
                  <i className="fas fa-check-circle text-green-500"></i>
                )}
                {showResult && index === selectedAnswer && index !== question.correctIndex && (
                  <i className="fas fa-times-circle text-red-500"></i>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* نتيجة السؤال */}
      {showResult && (
        <div className={`text-center p-4 rounded-lg mb-4 ${
          selectedAnswer === question.correctIndex ? 
          'bg-green-50 text-green-700' : 
          'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <i className={`fas ${
              selectedAnswer === question.correctIndex ? 'fa-check-circle' : 'fa-times-circle'
            } text-2xl`}></i>
            <span className="text-lg font-bold">
              {selectedAnswer === question.correctIndex ? 
                'إجابة صحيحة! 🎉' : 
                selectedAnswer === -1 ? 'انتهى الوقت! ⏰' : 'إجابة خاطئة 😞'
              }
            </span>
          </div>
          
          {selectedAnswer !== question.correctIndex && (
            <p className="text-sm">
              الإجابة الصحيحة: <strong>{question.options[question.correctIndex]}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// مكون الاختبار الرئيسي
const Quiz = ({ words, title, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // إنشاء الأسئلة من الكلمات
  const generateQuestions = useCallback(() => {
    if (!words || words.length < 2) return [];

    const questions = [];
    
    words.forEach((word, index) => {
      // إنشاء سؤال من الإنجليزية للعربية
      const englishToArabic = {
        id: `en_ar_${index}`,
        type: 'englishToArabic',
        word: word.english,
        correctAnswer: word.arabic,
        correctIndex: 0,
        example: word.example_en,
        options: []
      };

      // إنشاء سؤال من العربية للإنجليزية
      const arabicToEnglish = {
        id: `ar_en_${index}`,
        type: 'arabicToEnglish',
        word: word.arabic,
        correctAnswer: word.english,
        correctIndex: 0,
        example: word.example_ar,
        options: []
      };

      // إنشاء خيارات خاطئة
      const createWrongOptions = (correctAnswer, allWords, field) => {
        const wrongOptions = allWords
          .filter(w => w[field] !== correctAnswer)
          .map(w => w[field])
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        return wrongOptions;
      };

      // إضافة الخيارات للسؤال الأول
      const wrongArabicOptions = createWrongOptions(word.arabic, words, 'arabic');
      englishToArabic.options = [word.arabic, ...wrongArabicOptions]
        .sort(() => Math.random() - 0.5);
      englishToArabic.correctIndex = englishToArabic.options.indexOf(word.arabic);

      // إضافة الخيارات للسؤال الثاني
      const wrongEnglishOptions = createWrongOptions(word.english, words, 'english');
      arabicToEnglish.options = [word.english, ...wrongEnglishOptions]
        .sort(() => Math.random() - 0.5);
      arabicToEnglish.correctIndex = arabicToEnglish.options.indexOf(word.english);

      questions.push(englishToArabic, arabicToEnglish);
    });

    // خلط الأسئلة
    return questions.sort(() => Math.random() - 0.5);
  }, [words]);

  // تحضير الاختبار
  useEffect(() => {
    const generatedQuestions = generateQuestions();
    setQuestions(generatedQuestions);
  }, [generateQuestions]);

  // بدء الاختبار
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    setResults(null);
  };

  // معالجة الإجابة
  const handleAnswer = (isCorrect, selectedIndex, timeRemaining) => {
    const newAnswer = {
      questionId: questions[currentQuestionIndex].id,
      isCorrect,
      selectedIndex,
      timeRemaining,
      timeTaken: 30 - timeRemaining
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // الانتقال للسؤال التالي أو إنهاء الاختبار
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeQuiz(newAnswers);
      }
    }, 1000);
  };

  // إنهاء الاختبار وحساب النتائج
  const completeQuiz = (finalAnswers) => {
    const correctAnswers = finalAnswers.filter(answer => answer.isCorrect).length;
    const totalQuestions = finalAnswers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const averageTime = finalAnswers.reduce((sum, answer) => sum + answer.timeTaken, 0) / totalQuestions;

    const results = {
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      percentage,
      averageTime: Math.round(averageTime),
      grade: getGrade(percentage),
      answers: finalAnswers
    };

    setResults(results);
    setQuizCompleted(true);

    // إرسال النتائج للمكون الأب إذا كان متوفراً
    if (onComplete) {
      onComplete(results);
    }
  };

  // تحديد الدرجة حسب النسبة
  const getGrade = (percentage) => {
    if (percentage >= 90) return { letter: 'A+', color: 'text-green-600', emoji: '🏆' };
    if (percentage >= 80) return { letter: 'A', color: 'text-green-500', emoji: '🌟' };
    if (percentage >= 70) return { letter: 'B', color: 'text-blue-500', emoji: '👍' };
    if (percentage >= 60) return { letter: 'C', color: 'text-yellow-500', emoji: '😊' };
    if (percentage >= 50) return { letter: 'D', color: 'text-orange-500', emoji: '😐' };
    return { letter: 'F', color: 'text-red-500', emoji: '😞' };
  };

  // إعادة الاختبار
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  // عدم عرض شيء إذا لم تكن هناك كلمات
  if (!words || words.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">لا توجد كلمات متاحة للاختبار</p>
      </div>
    );
  }

  // شاشة البداية
  if (!quizStarted) {
    return (
      <div className="quiz-start bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <i className="fas fa-clipboard-check text-6xl text-blue-500 mb-4"></i>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {title || 'اختبار الكلمات'}
          </h2>
          <p className="text-gray-600">اختبر معرفتك بالكلمات التي تعلمتها</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">معلومات الاختبار:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3">
              <i className="fas fa-question-circle text-blue-500 mb-2"></i>
              <p className="font-semibold">عدد الأسئلة</p>
              <p className="text-gray-600">{questions.length} سؤال</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <i className="fas fa-clock text-green-500 mb-2"></i>
              <p className="font-semibold">الوقت لكل سؤال</p>
              <p className="text-gray-600">30 ثانية</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <i className="fas fa-star text-yellow-500 mb-2"></i>
              <p className="font-semibold">النجاح</p>
              <p className="text-gray-600">60% أو أكثر</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-3">التعليمات:</h4>
          <ul className="text-sm text-gray-600 text-right space-y-1">
            <li>• اقرأ السؤال بعناية واختر الإجابة الصحيحة</li>
            <li>• لديك 30 ثانية للإجابة على كل سؤال</li>
            <li>• يمكنك الاستماع لنطق الكلمة بالضغط على أيقونة الصوت</li>
            <li>• النتيجة ستظهر مباشرة بعد كل إجابة</li>
            <li>• في النهاية ستحصل على تقرير شامل عن أدائك</li>
          </ul>
        </div>

        <button
          onClick={startQuiz}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-bold
                     hover:bg-blue-600 transition-colors btn-press
                     flex items-center justify-center gap-3 mx-auto"
        >
          <i className="fas fa-play"></i>
          ابدأ الاختبار
        </button>
      </div>
    );
  }

  // شاشة النتائج
  if (quizCompleted && results) {
    return (
      <div className="quiz-results bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{results.grade.emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            انتهى الاختبار!
          </h2>
          <div className={`text-4xl font-bold mb-4 ${results.grade.color}`}>
            {results.percentage}% - {results.grade.letter}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <i className="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
            <h3 className="font-bold text-green-700">إجابات صحيحة</h3>
            <p className="text-2xl font-bold text-green-600">
              {results.correctAnswers}
            </p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <i className="fas fa-times-circle text-3xl text-red-500 mb-2"></i>
            <h3 className="font-bold text-red-700">إجابات خاطئة</h3>
            <p className="text-2xl font-bold text-red-600">
              {results.wrongAnswers}
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <i className="fas fa-clock text-3xl text-blue-500 mb-2"></i>
            <h3 className="font-bold text-blue-700">متوسط الوقت</h3>
            <p className="text-2xl font-bold text-blue-600">
              {results.averageTime}s
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <i className="fas fa-percentage text-3xl text-purple-500 mb-2"></i>
            <h3 className="font-bold text-purple-700">معدل النجاح</h3>
            <p className="text-2xl font-bold text-purple-600">
              {results.percentage}%
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={restartQuiz}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold
                       hover:bg-blue-600 transition-colors btn-press
                       flex items-center gap-2"
          >
            <i className="fas fa-redo"></i>
            إعادة الاختبار
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold
                       hover:bg-gray-600 transition-colors btn-press
                       flex items-center gap-2"
          >
            <i className="fas fa-arrow-right"></i>
            العودة
          </button>
        </div>
      </div>
    );
  }

  // شاشة السؤال
  return (
    <div className="quiz-container">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
    </div>
  );
};

export default Quiz;