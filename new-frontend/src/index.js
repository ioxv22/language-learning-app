// ===================================
// Entry Point - نقطة دخول التطبيق
// يقوم بتشغيل التطبيق وربطه بالـ DOM
// ===================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
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
  console.log(`
🚀 منصة تعليم اللغات - Language Learning Platform
📚 الإصدار: 1.0.0
⚛️  React: ${React.version}
🔧 البيئة: ${process.env.NODE_ENV}
🌐 الرابط: http://localhost:3000
  `);
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

// إخفاء شاشة التحميل بعد تحميل التطبيق
setTimeout(() => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}, 1000);