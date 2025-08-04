'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function BottomBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('pathRideBannerDismissed');
    if (!bannerDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pathRideBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Support PATH Tracker!</span>
              <span className="hidden sm:inline"> Help us keep running by buying us a PATH ride.</span>
              <span className="sm:hidden"> Buy us a PATH ride!</span>
            </p>
            <Link
              href="https://www.buymeacoffee.com/himrnoodles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-medium text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-105 self-start sm:self-auto"
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                color: "rgb(95, 127, 255)",
              }}
            >
              <span className="inline-block mr-2" style={{ transform: "scale(0.9)" }}>
                🚆
              </span>
              Buy us a PATH ride
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition-colors p-1 shrink-0"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}