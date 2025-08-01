// ===================================
// ContactPage Component - صفحة تواصل معنا
// تحتوي على معلومات الاتصال ونموذج التواصل
// ===================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    course_interest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        course_interest: ''
      });
      
      // إخفاء رسالة النجاح بعد 5 ثوان
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 2000);
  };

  const contactInfo = {
    email: "hk102573@gmail.com",
    phone: "+971 54 440 1266",
    location: "أبوظبي، الإمارات العربية المتحدة",
    support_hours: "الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً",
    response_time: "خلال 24 ساعة"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              <i className="fas fa-envelope text-primary-200 ml-4"></i>
              تواصل معنا
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              نحن هنا لمساعدتك في رحلة تعلم اللغة الإنجليزية. تواصل معنا في أي وقت!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* معلومات الاتصال السريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="card text-center bg-primary-50 hover:bg-primary-100 transition-colors">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-primary-700 mb-2">البريد الإلكتروني</h3>
            <p className="text-primary-600 font-medium">{contactInfo.email}</p>
            <p className="text-sm text-primary-500 mt-1">استجابة {contactInfo.response_time}</p>
          </div>

          <div className="card text-center bg-success-50 hover:bg-success-100 transition-colors">
            <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-phone text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-success-700 mb-2">الهاتف</h3>
            <p className="text-success-600 font-medium" dir="ltr">{contactInfo.phone}</p>
            <p className="text-sm text-success-500 mt-1">اتصال مباشر</p>
          </div>

          <div className="card text-center bg-warning-50 hover:bg-warning-100 transition-colors">
            <div className="w-16 h-16 bg-warning-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-map-marker-alt text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-warning-700 mb-2">الموقع</h3>
            <p className="text-warning-600 font-medium">{contactInfo.location}</p>
            <p className="text-sm text-warning-500 mt-1">موقعنا الرئيسي</p>
          </div>

          <div className="card text-center bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clock text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2">ساعات العمل</h3>
            <p className="text-purple-600 font-medium text-sm leading-relaxed">{contactInfo.support_hours}</p>
            <p className="text-sm text-purple-500 mt-1">دعم مستمر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* نموذج الاتصال */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <i className="fas fa-paper-plane text-primary-600 ml-3"></i>
              أرسل لنا رسالة
            </h2>

            {submitStatus === 'success' && (
              <div className="alert alert-success mb-6">
                <i className="fas fa-check-circle ml-2"></i>
                تم إرسال رسالتك بنجاح! سنرد عليك قريباً.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <i className="fas fa-user text-gray-400 ml-2"></i>
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">
                    <i className="fas fa-envelope text-gray-400 ml-2"></i>
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    <i className="fas fa-phone text-gray-400 ml-2"></i>
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="+971 50 123 4567"
                  />
                </div>
                
                <div>
                  <label className="form-label">
                    <i className="fas fa-graduation-cap text-gray-400 ml-2"></i>
                    الكورس المهتم به
                  </label>
                  <select
                    name="course_interest"
                    value={formData.course_interest}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="">اختر الكورس</option>
                    <option value="beginner">English for Beginners</option>
                    <option value="business">Business English</option>
                    <option value="advanced">Advanced Grammar</option>
                    <option value="travel">Travel English</option>
                    <option value="medical">Medical English</option>
                    <option value="ielts">IELTS Preparation</option>
                    <option value="conversation">Conversation Skills</option>
                    <option value="kids">Kids English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">
                  <i className="fas fa-tag text-gray-400 ml-2"></i>
                  موضوع الرسالة *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="عن ماذا تريد أن تتحدث؟"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  <i className="fas fa-comment-alt text-gray-400 ml-2"></i>
                  الرسالة *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="اكتب رسالتك هنا... نحن نتطلع لسماع أسئلتك واقتراحاتك"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-2"></i>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane ml-2"></i>
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>

          {/* معلومات إضافية */}
          <div className="space-y-8">
            
            {/* الأسئلة الشائعة */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <i className="fas fa-question-circle text-primary-600 ml-2"></i>
                أسئلة شائعة
              </h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">كيف يمكنني البدء في التعلم؟</h4>
                  <p className="text-gray-600 text-sm">يمكنك البدء فوراً بتصفح الكورسات واختيار المستوى المناسب لك. جميع الكورسات مجانية للمبتدئين.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">هل توجد شهادات معتمدة؟</h4>
                  <p className="text-gray-600 text-sm">نعم، نقدم شهادات إتمام لجميع الكورسات المدفوعة بعد اجتياز الاختبارات النهائية.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">كم من الوقت أحتاج لإتقان الإنجليزية؟</h4>
                  <p className="text-gray-600 text-sm">يعتمد ذلك على مستواك الحالي والوقت المخصص يومياً. مع الممارسة المنتظمة، يمكن تحقيق تقدم ملحوظ في 3-6 أشهر.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">هل يمكنني الدراسة على الهاتف؟</h4>
                  <p className="text-gray-600 text-sm">بالطبع! منصتنا متوافقة مع جميع الأجهزة الذكية والأجهزة اللوحية.</p>
                </div>
              </div>
            </div>

            {/* وسائل التواصل الاجتماعي */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <i className="fas fa-share-alt text-primary-600 ml-2"></i>
                تابعنا على وسائل التواصل
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <i className="fab fa-instagram text-pink-500 text-xl ml-2"></i>
                  <span className="font-medium text-gray-700">Instagram</span>
                </a>
                
                <a href="#" className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <i className="fab fa-twitter text-blue-400 text-xl ml-2"></i>
                  <span className="font-medium text-gray-700">Twitter</span>
                </a>
                
                <a href="#" className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <i className="fab fa-linkedin text-blue-600 text-xl ml-2"></i>
                  <span className="font-medium text-gray-700">LinkedIn</span>
                </a>
                
                <a href="#" className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <i className="fab fa-youtube text-red-500 text-xl ml-2"></i>
                  <span className="font-medium text-gray-700">YouTube</span>
                </a>
              </div>
            </div>

            {/* نصائح سريعة */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
              <h3 className="text-xl font-bold text-primary-800 mb-4">
                <i className="fas fa-lightbulb text-warning-500 ml-2"></i>
                نصائح للتعلم السريع
              </h3>
              
              <ul className="space-y-3 text-primary-700">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success-500 ml-2 mt-1"></i>
                  <span>خصص 15-30 دقيقة يومياً للدراسة</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success-500 ml-2 mt-1"></i>
                  <span>استمع للإنجليزية يومياً (أفلام، موسيقى، بودكاست)</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success-500 ml-2 mt-1"></i>
                  <span>تدرب على المحادثة مع الآخرين</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-success-500 ml-2 mt-1"></i>
                  <span>لا تخف من الأخطاء - هي جزء من التعلم</span>
                </li>
              </ul>
            </div>

            {/* رابط سريع للكورسات */}
            <div className="card bg-gradient-to-r from-success-500 to-success-600 text-white text-center">
              <h3 className="text-xl font-bold mb-3">مستعد للبدء؟</h3>
              <p className="mb-4 text-success-100">اكتشف كورساتنا المتنوعة وابدأ رحلتك اليوم!</p>
              <Link to="/courses" className="btn bg-white text-success-600 hover:bg-success-50 font-semibold">
                <i className="fas fa-graduation-cap ml-2"></i>
                تصفح الكورسات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;