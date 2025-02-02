"use client";

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже получено согласие
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-600 montserrat">
            Мы используем файлы cookie для улучшения работы сайта и повышения удобства пользователей. 
            Продолжая использовать сайт, вы соглашаетесь с использованием файлов cookie.
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-all duration-300 whitespace-nowrap montserrat"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 