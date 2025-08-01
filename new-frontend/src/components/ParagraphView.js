// ===================================
// ParagraphView Component - مكون عرض الفقرة
// يعرض محتوى الفقرة مع الكلمات المفتاحية والاختبارات وتمارين الكتابة
// ===================================

import React, { useState, useEffect } from 'react';
import { speechAPI, quizAPI, writingAPI, progressAPI, utils } from '../services/api';

const ParagraphView = ({ paragraph, onComplete }) => {
  const [currentSection, setCurrentSection] = useState('content'); // content, quiz, writing
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingText, setPlayingText] = useState('');

  // حالات الاختبار
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // حالات تمارين الكتابة
  const [writingAnswers, setWritingAnswers] = useState({});
  const [writingResults, setWritingResults] = useState({});
  const [isCheckingWriting, setIsCheckingWriting] = useState({});

  useEffect(() => {
    // تهيئة إجابات الاختبار
    if (paragraph.quiz) {
      setQuizAnswers(new Array(paragraph.quiz.length).fill(-1));
    }

    // تهيئة إجابات تمارين الكتابة
    if (paragraph.writingExercises) {
      const initialAnswers = {};
      paragraph.writingExercises.forEach(exercise => {
        initialAnswers[exercise.id] = '';
      });
      setWritingAnswers(initialAnswers);
    }
  }, [paragraph]);

  // وظيفة تشغيل الصوت
  const handleSpeak = async (text, language = 'en-US', elementId = null) => {
    try {
      if (isPlaying) {
        speechAPI.stop();
        setIsPlaying(false);
        setPlayingText('');
        return;
      }

      setIsPlaying(true);
      setPlayingText(elementId || text);
      
      await speechAPI.speak(text, language);
      
      setIsPlaying(false);
      setPlayingText('');
    } catch (error) {
      console.error('خطأ في النطق:', error);
      setIsPlaying(false);
      setPlayingText('');
    }
  };

  // التعامل مع إجابات الاختبار
  const handleQuizAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  // إرسال الاختبار
  const handleSubmitQuiz = async () => {
    if (quizAnswers.includes(-1)) {
      alert('يرجى الإجابة على جميع الأسئلة');
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const response = await quizAPI.submit(paragraph.id, quizAnswers);
      setQuizResults(response.data);
      setShowQuizResults(true);
      
      // حفظ النتيجة
      progressAPI.saveQuizResult(paragraph.id, response.data);
      
    } catch (error) {
      console.error('خطأ في إرسال الاختبار:', error);
      alert('حدث خطأ في إرسال الاختبار');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // إعادة الاختبار
  const handleRetakeQuiz = () => {
    setQuizAnswers(new Array(paragraph.quiz.length).fill(-1));
    setQuizResults(null);
    setShowQuizResults(false);
  };

  // التعامل مع تمارين الكتابة
  const handleWritingAnswer = (exerciseId, answer) => {
    setWritingAnswers(prev => ({
      ...prev,
      [exerciseId]: answer
    }));
  };

  // فحص تمرين الكتابة
  const handleCheckWriting = async (exercise) => {
    const answer = writingAnswers[exercise.id];
    if (!answer.trim()) {
      alert('يرجى كتابة إجابة');
      return;
    }

    setIsCheckingWriting(prev => ({ ...prev, [exercise.id]: true }));
    
    try {
      const response = await writingAPI.check(paragraph.id, exercise.id, answer);
      setWritingResults(prev => ({
        ...prev,
        [exercise.id]: response.data
      }));
      
      // حفظ النتيجة
      progressAPI.saveWritingResult(exercise.id, response.data);
      
    } catch (error) {
      console.error('خطأ في فحص التمرين:', error);
      alert('حدث خطأ في فحص التمرين');
    } finally {
      setIsCheckingWriting(prev => ({ ...prev, [exercise.id]: false }));
    }
  };

  // التنقل بين الأقسام
  const renderSectionNavigation = () => (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <button
          onClick={() => setCurrentSection('content')}
          className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
            currentSection === 'content' 
              ? 'bg-white text-primary-600 shadow-sm font-semibold' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <i className="fas fa-book-open text-sm"></i>
          المحتوى
        </button>
        
        {paragraph.quiz && paragraph.quiz.length > 0 && (
          <button
            onClick={() => setCurrentSection('quiz')}
            className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
              currentSection === 'quiz' 
                ? 'bg-white text-primary-600 shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-question-circle text-sm"></i>
            الاختبار ({paragraph.quiz.length})
          </button>
        )}
        
        {paragraph.writingExercises && paragraph.writingExercises.length > 0 && (
          <button
            onClick={() => setCurrentSection('writing')}
            className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
              currentSection === 'writing' 
                ? 'bg-white text-primary-600 shadow-sm font-semibold' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="fas fa-pencil-alt text-sm"></i>
            تمارين الكتابة ({paragraph.writingExercises.length})
          </button>
        )}
      </div>
    </div>
  );

  // عرض المحتوى
  const renderContent = () => (
    <div className="space-y-8 animate-fade-in">
      
      {/* محتوى الفقرة */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{paragraph.title}</h2>
          <button
            onClick={() => handleSpeak(paragraph.title, 'en-US', 'title')}
            className={`speak-btn ${isPlaying && playingText === 'title' ? 'playing' : ''}`}
            title="استمع للعنوان"
          >
            <i className={`fas fa-volume-up ${isPlaying && playingText === 'title' ? 'fa-bounce' : ''}`}></i>
          </button>
        </div>

        {/* المحتوى الإنجليزي */}
        <div className="bg-primary-50 p-6 rounded-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-800 mb-3 english-text">English Content</h3>
              <p className="text-gray-700 leading-relaxed english-text">{paragraph.content}</p>
            </div>
            <button
              onClick={() => handleSpeak(paragraph.content, 'en-US', 'content')}
              className={`speak-btn ml-4 ${isPlaying && playingText === 'content' ? 'playing' : ''}`}
              title="استمع للمحتوى الإنجليزي"
            >
              <i className={`fas fa-volume-up ${isPlaying && playingText === 'content' ? 'fa-bounce' : ''}`}></i>
            </button>
          </div>
        </div>

        {/* الترجمة العربية */}
        <div className="bg-success-50 p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-success-800 mb-3">الترجمة العربية</h3>
              <p className="text-gray-700 leading-relaxed arabic-text">{paragraph.translation}</p>
            </div>
            <button
              onClick={() => handleSpeak(paragraph.translation, 'ar-SA', 'translation')}
              className={`speak-btn mr-4 ${isPlaying && playingText === 'translation' ? 'playing' : ''}`}
              title="استمع للترجمة العربية"
            >
              <i className={`fas fa-volume-up ${isPlaying && playingText === 'translation' ? 'fa-bounce' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* الكلمات المفتاحية */}
      {paragraph.keyWords && paragraph.keyWords.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-key text-primary-600"></i>
            الكلمات المفتاحية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paragraph.keyWords.map((word, index) => (
              <div key={index} className="keyword-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="english-text font-bold text-lg text-primary-700">{word.word}</span>
                    <button
                      onClick={() => handleSpeak(word.word, 'en-US', `word-${index}`)}
                      className={`speak-btn text-sm ${isPlaying && playingText === `word-${index}` ? 'playing' : ''}`}
                    >
                      <i className={`fas fa-volume-up ${isPlaying && playingText === `word-${index}` ? 'fa-bounce' : ''}`}></i>
                    </button>
                  </div>
                  <span className="text-primary-600 font-medium">{word.translation}</span>
                </div>
                
                {word.pronunciation && (
                  <div className="text-sm text-gray-600 mb-2 english-text">
                    <i className="fas fa-microphone text-gray-400 ml-1"></i>
                    {word.pronunciation}
                  </div>
                )}
                
                <div className="text-sm">
                  <div className="english-text text-gray-600 mb-1">"{word.example}"</div>
                  <div className="arabic-text text-gray-500">"{word.translation}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // عرض الاختبار
  const renderQuiz = () => (
    <div className="space-y-6 animate-fade-in">
      
      {!showQuizResults ? (
        <>
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-question-circle text-primary-600"></i>
              اختبار الفقرة
            </h2>
            
            <div className="space-y-6">
              {paragraph.quiz && paragraph.quiz.length > 0 ? paragraph.quiz.map((question, qIndex) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      سؤال {qIndex + 1}
                    </h3>
                    <p className="text-gray-700 english-text mb-2">{question.question}</p>
                    <p className="text-gray-600 arabic-text">{question.questionAr}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`quiz-option block ${
                          quizAnswers[qIndex] === oIndex ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={oIndex}
                          checked={quizAnswers[qIndex] === oIndex}
                          onChange={() => handleQuizAnswer(qIndex, oIndex)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="english-text font-medium">{option}</div>
                            <div className="arabic-text text-sm text-gray-600">{question.optionsAr && question.optionsAr[oIndex] ? question.optionsAr[oIndex] : ''}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            quizAnswers[qIndex] === oIndex 
                              ? 'bg-primary-600 border-primary-600' 
                              : 'border-gray-300'
                          }`}>
                            {quizAnswers[qIndex] === oIndex && (
                              <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <i className="fas fa-question-circle text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد اختبارات متاحة</h3>
                  <p className="text-gray-500">لم يتم إضافة أسئلة لهذه الفقرة بعد</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmittingQuiz || quizAnswers.includes(-1)}
                className="btn btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingQuiz ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                    جاري التقييم...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check ml-2"></i>
                    إرسال الإجابات
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <QuizResults 
          results={quizResults} 
          onRetake={handleRetakeQuiz}
          onContinue={() => setCurrentSection('writing')}
        />
      )}
    </div>
  );

  // عرض تمارين الكتابة
  const renderWriting = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="fas fa-pencil-alt text-primary-600"></i>
          تمارين الكتابة
        </h2>
        
        <div className="space-y-8">
          {paragraph.writingExercises && paragraph.writingExercises.length > 0 ? paragraph.writingExercises.map((exercise, index) => (
            <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  تمرين {index + 1}
                </h3>
                <p className="text-gray-700 english-text mb-2">{exercise.instruction}</p>
                <p className="text-gray-600 arabic-text">{exercise.instructionAr}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-800 english-text mb-4">
                  {exercise.sentence}
                </p>
                
                <input
                  type="text"
                  value={writingAnswers[exercise.id] || ''}
                  onChange={(e) => handleWritingAnswer(exercise.id, e.target.value)}
                  placeholder="اكتب إجابتك هنا..."
                  className={`writing-input ${
                    writingResults[exercise.id] 
                      ? writingResults[exercise.id].isCorrect 
                        ? 'correct' 
                        : 'incorrect'
                      : ''
                  }`}
                />
              </div>
              
              {/* نتيجة التمرين */}
              {writingResults[exercise.id] && (
                <div className={`alert ${
                  writingResults[exercise.id].isCorrect 
                    ? 'alert-success' 
                    : writingResults[exercise.id].isClose 
                      ? 'alert-warning'
                      : 'alert-danger'
                } mb-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`fas ${
                      writingResults[exercise.id].isCorrect 
                        ? 'fa-check-circle' 
                        : writingResults[exercise.id].isClose
                          ? 'fa-exclamation-circle'
                          : 'fa-times-circle'
                    }`}></i>
                    <span className="font-semibold">{writingResults[exercise.id].feedback}</span>
                  </div>
                  
                  {!writingResults[exercise.id].isCorrect && (
                    <div className="text-sm">
                      <div className="mb-1">
                        <strong>الإجابة الصحيحة:</strong> {writingResults[exercise.id].correctAnswer}
                      </div>
                      {writingResults[exercise.id].hint && (
                        <div>
                          <strong>تلميح:</strong> {writingResults[exercise.id].hintAr}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  onClick={() => handleCheckWriting(exercise)}
                  disabled={isCheckingWriting[exercise.id] || !writingAnswers[exercise.id]?.trim()}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingWriting[exercise.id] ? (
                    <>
                      <i className="fas fa-spinner fa-spin ml-2"></i>
                      جاري الفحص...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check ml-2"></i>
                      فحص الإجابة
                    </>
                  )}
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <i className="fas fa-pencil-alt text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد تمارين كتابة متاحة</h3>
              <p className="text-gray-500">لم يتم إضافة تمارين كتابة لهذه الفقرة بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {renderSectionNavigation()}
      
      {currentSection === 'content' && renderContent()}
      {currentSection === 'quiz' && renderQuiz()}
      {currentSection === 'writing' && renderWriting()}
    </div>
  );
};

// مكون نتائج الاختبار
const QuizResults = ({ results, onRetake, onContinue }) => {
  const gradeInfo = utils.getGrade(results.score);
  
  return (
    <div className="card animate-fade-in">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
          results.passed ? 'bg-success-100' : 'bg-danger-100'
        }`}>
          <i className={`fas ${results.passed ? 'fa-trophy' : 'fa-times'} text-4xl ${
            results.passed ? 'text-success-600' : 'text-danger-600'
          }`}></i>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">نتائج الاختبار</h2>
        <div className={`text-6xl font-bold mb-2 ${
          gradeInfo.color === 'success' ? 'text-success-600' : 
          gradeInfo.color === 'warning' ? 'text-warning-600' : 'text-danger-600'
        }`}>
          {results.score}%
        </div>
        <div className={`text-2xl font-bold ${
          gradeInfo.color === 'success' ? 'text-success-600' : 
          gradeInfo.color === 'warning' ? 'text-warning-600' : 'text-danger-600'
        }`}>
          {gradeInfo.grade}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">{results.correctAnswers}</div>
          <div className="text-gray-600">إجابات صحيحة</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-danger-600 mb-2">{results.totalQuestions - results.correctAnswers}</div>
          <div className="text-gray-600">إجابات خاطئة</div>
        </div>
      </div>

      {/* تفاصيل النتائج */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-800">مراجعة الإجابات:</h3>
        {results.results.map((result, index) => (
          <div
            key={result.questionId}
            className={`p-4 rounded-lg border ${
              result.isCorrect 
                ? 'border-success-200 bg-success-50' 
                : 'border-danger-200 bg-danger-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result.isCorrect ? 'bg-success-600' : 'bg-danger-600'
              }`}>
                <i className={`fas ${result.isCorrect ? 'fa-check' : 'fa-times'} text-white text-sm`}></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 mb-1">{result.questionAr}</div>
                {!result.isCorrect && (
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">{result.explanationAr}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={onRetake} className="btn btn-outline">
          <i className="fas fa-redo ml-2"></i>
          إعادة الاختبار
        </button>
        {onContinue && (
          <button onClick={onContinue} className="btn btn-primary">
            <i className="fas fa-arrow-left ml-2"></i>
            متابعة للتمارين
          </button>
        )}
      </div>
    </div>
  );
};

export default ParagraphView;