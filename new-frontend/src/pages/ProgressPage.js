// ===================================
// ProgressPage Component - صفحة متابعة التقدم
// تعرض إحصائيات تفصيلية عن تقدم المستخدم
// ===================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, progressAPI, storageAPI, utils } from '../services/api';

const ProgressPage = () => {
  const [overallStats, setOverallStats] = useState({});
  const [courseProgress, setCourseProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        // جلب بيانات الكورسات
        const coursesResponse = await coursesAPI.getAll();
        const courses = coursesResponse.data || [];
        
        // حساب التقدم لكل كورس
        const courseProgressData = [];
        let totalLessons = 0;
        let completedLessons = 0;
        let totalQuizzes = 0;
        let completedQuizzes = 0;
        let totalWords = 0;
        let masteredWords = 0;

        for (const course of courses) {
          try {
            const lessonsResponse = await coursesAPI.getLessons(course.id);
            const lessons = lessonsResponse.data || [];
            
            let courseLessonsCompleted = 0;
            let courseQuizzesCompleted = 0;
            let courseWordsLearned = 0;

            lessons.forEach(lesson => {
              const lessonProgress = progressAPI.getProgress(lesson.id);
              if (lessonProgress.progress >= 100) {
                courseLessonsCompleted++;
                completedLessons++;
              }
              totalLessons++;

              // إحصائيات وهمية للاختبارات والكلمات
              const mockQuizzes = 2;
              const mockWords = 5;
              
              totalQuizzes += mockQuizzes;
              totalWords += mockWords;
              
              if (lessonProgress.progress >= 100) {
                courseQuizzesCompleted += mockQuizzes;
                courseWordsLearned += mockWords;
                completedQuizzes += mockQuizzes;
                masteredWords += mockWords;
              }
            });

            const courseProgressPercentage = lessons.length > 0 
              ? Math.round((courseLessonsCompleted / lessons.length) * 100)
              : 0;

            courseProgressData.push({
              ...course,
              lessonsTotal: lessons.length,
              lessonsCompleted: courseLessonsCompleted,
              progressPercentage: courseProgressPercentage,
              quizzesCompleted: courseQuizzesCompleted,
              wordsLearned: courseWordsLearned,
              lastActivity: storageAPI.get(`course_last_activity_${course.id}`, null)
            });

          } catch (err) {
            console.error(`خطأ في جلب تقدم الكورس ${course.id}:`, err);
          }
        }

        // حساب الإحصائيات العامة
        const stats = {
          totalCourses: courses.length,
          completedCourses: courseProgressData.filter(c => c.progressPercentage >= 100).length,
          totalLessons,
          completedLessons,
          totalQuizzes,
          completedQuizzes,
          totalWords,
          masteredWords,
          overallProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          studyStreak: storageAPI.get('study_streak', 0),
          totalStudyTime: storageAPI.get('total_study_time', 0) // بالدقائق
        };

        // النشاطات الأخيرة (بيانات وهمية)
        const activities = [
          {
            type: 'lesson_completed',
            title: 'أكملت درس "Introduction to English"',
            timestamp: Date.now() - 1000 * 60 * 30, // منذ 30 دقيقة
            course: 'English Basics',
            icon: 'fa-check-circle',
            color: 'success'
          },
          {
            type: 'quiz_passed',
            title: 'نجحت في اختبار "Basic Greetings"',
            timestamp: Date.now() - 1000 * 60 * 60 * 2, // منذ ساعتين
            course: 'English Basics',
            score: 85,
            icon: 'fa-trophy',
            color: 'warning'
          },
          {
            type: 'word_mastered',
            title: 'أتقنت 5 كلمات جديدة',
            timestamp: Date.now() - 1000 * 60 * 60 * 4, // منذ 4 ساعات
            course: 'English Basics',
            icon: 'fa-star',
            color: 'primary'
          }
        ];

        // الإنجازات
        const userAchievements = [
          {
            id: 'first_lesson',
            title: 'أول خطوة',
            description: 'أكمل درسك الأول',
            icon: 'fa-baby',
            unlocked: completedLessons > 0,
            unlockedAt: completedLessons > 0 ? Date.now() - 1000 * 60 * 60 * 24 : null
          },
          {
            id: 'quiz_master',
            title: 'خبير الاختبارات',
            description: 'اجتز 5 اختبارات بنجاح',
            icon: 'fa-brain',
            unlocked: completedQuizzes >= 5,
            unlockedAt: completedQuizzes >= 5 ? Date.now() - 1000 * 60 * 60 * 12 : null
          },
          {
            id: 'word_collector',
            title: 'جامع الكلمات',
            description: 'أتقن 20 كلمة',
            icon: 'fa-language',
            unlocked: masteredWords >= 20,
            unlockedAt: masteredWords >= 20 ? Date.now() - 1000 * 60 * 60 * 6 : null
          },
          {
            id: 'course_master',
            title: 'سيد الكورس',
            description: 'أكمل كورساً كاملاً',
            icon: 'fa-graduation-cap',
            unlocked: courseProgressData.some(c => c.progressPercentage >= 100),
            unlockedAt: courseProgressData.some(c => c.progressPercentage >= 100) ? Date.now() - 1000 * 60 * 60 * 2 : null
          }
        ];

        setOverallStats(stats);
        setCourseProgress(courseProgressData);
        setRecentActivity(activities);
        setAchievements(userAchievements);

      } catch (error) {
        console.error('خطأ في جلب بيانات التقدم:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات التقدم...</p>
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
              <i className="fas fa-chart-line text-primary-600 ml-3"></i>
              متابعة التقدم
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تابع إنجازاتك ونشاطك التعليمي واكتشف نقاط قوتك
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* الإحصائيات العامة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="card text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-percentage text-2xl text-primary-600"></i>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {overallStats.overallProgress}%
            </div>
            <div className="text-gray-600 font-medium">التقدم العام</div>
            <div className="progress-bar mt-3">
              <div 
                className="progress-fill"
                style={{ width: `${overallStats.overallProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="card text-center">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-2xl text-success-600"></i>
            </div>
            <div className="text-3xl font-bold text-success-600 mb-2">
              {overallStats.completedLessons}
            </div>
            <div className="text-gray-600 font-medium">درس مكتمل</div>
            <div className="text-sm text-gray-500 mt-1">
              من أصل {overallStats.totalLessons}
            </div>
          </div>

          <div className="card text-center">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-fire text-2xl text-warning-600"></i>
            </div>
            <div className="text-3xl font-bold text-warning-600 mb-2">
              {overallStats.studyStreak}
            </div>
            <div className="text-gray-600 font-medium">أيام متتالية</div>
            <div className="text-sm text-gray-500 mt-1">
              سلسلة الدراسة
            </div>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-language text-2xl text-purple-600"></i>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {overallStats.masteredWords}
            </div>
            <div className="text-gray-600 font-medium">كلمة متقنة</div>
            <div className="text-sm text-gray-500 mt-1">
              من أصل {overallStats.totalWords}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* تقدم الكورسات */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-book text-primary-600 ml-2"></i>
                تقدم الكورسات
              </h2>
              
              <div className="space-y-6">
                {courseProgress.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {course.progressPercentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.lessonsCompleted}/{course.lessonsTotal}
                        </div>
                      </div>
                    </div>

                    <div className="progress-bar mb-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          course.progressPercentage >= 100 ? 'bg-success-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${course.progressPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-success-600">
                          <i className="fas fa-trophy mr-1"></i>
                          {course.quizzesCompleted} اختبار
                        </span>
                        <span className="text-purple-600">
                          <i className="fas fa-star mr-1"></i>
                          {course.wordsLearned} كلمة
                        </span>
                      </div>
                      
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {course.progressPercentage >= 100 ? 'مراجعة' : 'متابعة'}
                        <i className="fas fa-arrow-left mr-1"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* النشاطات الأخيرة والإنجازات */}
          <div className="space-y-8">
            
            {/* النشاطات الأخيرة */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-clock text-success-600 ml-2"></i>
                النشاطات الأخيرة
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${activity.color}-100 text-${activity.color}-600 flex-shrink-0`}>
                      <i className={`fas ${activity.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm">
                        {activity.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.course} • {utils.formatDate(activity.timestamp)}
                      </div>
                      {activity.score && (
                        <div className="text-xs text-success-600 mt-1 font-semibold">
                          النتيجة: {activity.score}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الإنجازات */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                <i className="fas fa-medal text-warning-600 ml-2"></i>
                الإنجازات
              </h2>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.unlocked ? 'bg-success-50 border border-success-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-success-500 text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      <i className={`fas ${achievement.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        achievement.unlocked ? 'text-success-700' : 'text-gray-600'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-success-600 mt-1">
                          تم الإنجاز: {utils.formatDate(achievement.unlockedAt)}
                        </div>
                      )}
                    </div>
                    {achievement.unlocked && (
                      <div className="text-success-500">
                        <i className="fas fa-check-circle text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات تفصيلية */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              <i className="fas fa-chart-bar text-purple-600 ml-2"></i>
              إحصائيات تفصيلية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {Math.round(overallStats.totalStudyTime / 60) || 0}
                </div>
                <div className="text-gray-600">ساعات دراسة</div>
                <div className="text-sm text-gray-500 mt-1">
                  {overallStats.totalStudyTime || 0} دقيقة إجمالي
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 mb-2">
                  {Math.round((overallStats.completedQuizzes / Math.max(overallStats.totalQuizzes, 1)) * 100)}%
                </div>
                <div className="text-gray-600">معدل نجاح الاختبارات</div>
                <div className="text-sm text-gray-500 mt-1">
                  {overallStats.completedQuizzes}/{overallStats.totalQuizzes}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600 mb-2">
                  {Math.round((overallStats.completedCourses / Math.max(overallStats.totalCourses, 1)) * 100)}%
                </div>
                <div className="text-gray-600">الكورسات المكتملة</div>
                <div className="text-sm text-gray-500 mt-1">
                  {overallStats.completedCourses}/{overallStats.totalCourses}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div className="text-gray-600">إنجازات محققة</div>
                <div className="text-sm text-gray-500 mt-1">
                  من أصل {achievements.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* خطة التحسين */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              <i className="fas fa-target text-primary-600 ml-2"></i>
              اقتراحات للتحسين
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {overallStats.overallProgress < 50 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <i className="fas fa-rocket text-primary-600 text-xl"></i>
                    <h3 className="font-semibold text-primary-700">تسريع التقدم</h3>
                  </div>
                  <p className="text-sm text-primary-600 mb-3">
                    أكمل درساً واحداً على الأقل يومياً لتحسين التقدم
                  </p>
                  <Link to="/courses" className="btn btn-primary btn-sm">
                    ابدأ درساً جديداً
                  </Link>
                </div>
              )}

              {overallStats.studyStreak < 7 && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <i className="fas fa-fire text-warning-600 text-xl"></i>
                    <h3 className="font-semibold text-warning-700">زيادة الانتظام</h3>
                  </div>
                  <p className="text-sm text-warning-600 mb-3">
                    ادرس يومياً لبناء عادة دراسية قوية
                  </p>
                  <Link to="/chapters" className="btn btn-warning btn-sm">
                    تصفح الدروس
                  </Link>
                </div>
              )}

              {(overallStats.masteredWords / Math.max(overallStats.totalWords, 1)) < 0.7 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <i className="fas fa-language text-purple-600 text-xl"></i>
                    <h3 className="font-semibold text-purple-700">تحسين المفردات</h3>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">
                    راجع الكلمات بانتظام لتحسين مهاراتك اللغوية
                  </p>
                  <Link to="/review" className="btn btn-secondary btn-sm">
                    مراجعة الكلمات
                  </Link>
                </div>
              )}

              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-trophy text-success-600 text-xl"></i>
                  <h3 className="font-semibold text-success-700">حافظ على التقدم</h3>
                </div>
                <p className="text-sm text-success-600 mb-3">
                  أنت تحرز تقدماً ممتازاً! استمر في هذا المعدل
                </p>
                <div className="text-xs text-success-600 font-semibold">
                  نصيحة: خصص 15-30 دقيقة يومياً للدراسة
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;