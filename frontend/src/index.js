// ملف البداية الرئيسي - Entry Point
// يقوم بتشغيل التطبيق وربطه بالـ DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // استيراد الأنماط
import App from './App';

// إنشاء جذر التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));

// تشغيل التطبيق
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// إعدادات خاصة لتطوير التطبيق
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 تطبيق تعليم اللغات يعمل في وضع التطوير');
  console.log('📚 للوصول للدروس: http://localhost:3000/lessons');
  console.log('🎯 للوصول للفصول: http://localhost:3000/chapters');
}

// معالجة الأخطاء غير المتوقعة
window.addEventListener('error', (event) => {
  console.error('خطأ في التطبيق:', event.error);
});

// معالجة الوعود المرفوضة
window.addEventListener('unhandledrejection', (event) => {
  console.error('وعد مرفوض:', event.reason);
  event.preventDefault();
});

// تسجيل معلومات التطبيق
console.log(`
🌐 موقع تعليم اللغات
📱 إصدار التطبيق: 1.0.0
⚛️  React إصدار: ${React.version}
🔧 وضع التشغيل: ${process.env.NODE_ENV}
`);

// إعداد الـ Service Worker (للعمل بدون إنترنت - اختياري)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}