'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function BottomBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const footerObserverRef = useRef<IntersectionObserver | null>(null);
  const t = useTranslations('footer');

  useEffect(() => {
    // Check if banner was dismissed and if enough time has passed
    const dismissedAt = localStorage.getItem('pathRideBannerDismissedAt');
    
    if (!dismissedAt) {
      // Never dismissed or old key, show banner
      setIsVisible(true);
      // Clean up old key if it exists
      localStorage.removeItem('pathRideBannerDismissed');
    } else {
      // Check if 7 days have passed
      const dismissedTimestamp = parseInt(dismissedAt, 10);
      const currentTime = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (currentTime - dismissedTimestamp >= sevenDaysInMs) {
        // 7 days have passed, show banner again
        setIsVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    // Create intersection observer to detect when footer is visible
    footerObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldShow(false);
          } else {
            setShouldShow(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe footer element
    const footer = document.querySelector('footer');
    if (footer && footerObserverRef.current) {
      footerObserverRef.current.observe(footer);
    }

    return () => {
      if (footerObserverRef.current) {
        footerObserverRef.current.disconnect();
      }
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store the timestamp when the banner was dismissed
    localStorage.setItem('pathRideBannerDismissedAt', Date.now().toString());
  };

  if (!isVisible || !shouldShow) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-950/90 dark:via-indigo-950/90 dark:to-purple-950/90 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative border-t border-blue-200/30 dark:border-blue-800/30">
        <div className="container mx-auto max-w-7xl px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left side: Icon + Message + Button all in one row */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 shrink-0">
                <span className="text-base">🚆</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                <span className="hidden sm:inline">{t('bannerMessage')}</span>
                <span className="sm:hidden">{t('bannerMessageShort')}</span>
              </p>
              <Link
                href="https://www.buymeacoffee.com/himrnoodles"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md whitespace-nowrap shrink-0"
              >
                <span className="inline-block mr-1.5 sm:mr-2">🚆</span>
                {t('buyMeCoffee')}
              </Link>
            </div>
            
            {/* Right side: Close button */}
            <button
              onClick={handleDismiss}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors p-1.5 shrink-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}