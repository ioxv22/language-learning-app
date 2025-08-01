// ===================================
// AdminPage Component - لوحة تحكم الأدمن
// إدارة الكورسات والدروس والمحتوى
// ===================================

import React, { useState, useEffect } from 'react';
import { coursesAPI } from '../services/api';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalStudents: 0
  });

  // بيانات الدخول المعقدة
  const ADMIN_CREDENTIALS = {
    email: 'admin.hk102573@securelearning.ae',
    password: 'HK#2024$LearnEng!UAE@Admin157'
  };

  useEffect(() => {
    // فحص إذا كان الأدمن مسجل دخول مسبقاً
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    // محاكاة تأخير شبكة
    setTimeout(() => {
      if (loginData.email === ADMIN_CREDENTIALS.email && 
          loginData.password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        loadDashboardData();
      } else {
        setLoginError('بيانات الدخول غير صحيحة. تحقق من الإيميل وكلمة المرور.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setLoginData({ email: '', password: '' });
  };

  const loadDashboardData = async () => {
    try {
      const coursesResponse = await coursesAPI.getAll();
      setCourses(coursesResponse.data);
      
      setStats({
        totalCourses: coursesResponse.data.length,
        totalLessons: coursesResponse.data.reduce((sum, course) => sum + (course.lessons_count || 0), 0),
        totalStudents: coursesResponse.data.reduce((sum, course) => sum + (course.students || 0), 0)
      });
    } catch (error) {
      console.error('خطأ في تحميل بيانات اللوحة:', error);
    }
  };

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          
          {/* شعار الأدمن */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">لوحة تحكم الأدمن</h1>
            <p className="text-gray-300">منصة تعليم اللغة الإنجليزية</p>
          </div>

          {/* نموذج تسجيل الدخول */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                  <i className="fas fa-exclamation-triangle ml-2"></i>
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  <i className="fas fa-envelope ml-2"></i>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  <i className="fas fa-lock ml-2"></i>
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt ml-2"></i>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </form>

            {/* معلومات الدخول للعرض */}
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <h3 className="text-blue-200 font-semibold mb-2">
                <i className="fas fa-info-circle ml-1"></i>
                بيانات الدخول:
              </h3>
              <div className="text-xs text-blue-100 space-y-1 font-mono">
                <div><strong>الإيميل:</strong> admin.hk102573@securelearning.ae</div>
                <div><strong>كلمة المرور:</strong> HK#2024$LearnEng!UAE@Admin157</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // لوحة التحكم الرئيسية
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-cog text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold">لوحة تحكم الأدمن</h1>
                <p className="text-primary-100">إدارة منصة تعليم اللغة الإنجليزية</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-sign-out-alt ml-2"></i>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">إجمالي الكورسات</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <i className="fas fa-book text-primary-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-success-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">إجمالي الدروس</p>
                <p className="text-3xl font-bold text-success-600">{stats.totalLessons}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                <i className="fas fa-graduation-cap text-success-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-warning-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-warning-600">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <i className="fas fa-users text-warning-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* جدول الكورسات */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              <i className="fas fa-list-ul text-primary-600 ml-2"></i>
              جميع الكورسات
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكورس</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستوى</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدروس</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطلاب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ml-3 bg-${course.color}-500`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.instructor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level === 'beginner' ? 'مبتدئ' : 
                         course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.lessons_count} درس
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.students?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="fas fa-star text-yellow-400 text-sm ml-1"></i>
                        <span className="text-sm text-gray-900">{course.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;