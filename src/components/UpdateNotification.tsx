"use client";

import { useState, useEffect } from "react";

interface UpdateNotificationProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
  version?: string;
}

export function UpdateNotification({
  show,
  onUpdate,
  onDismiss,
  version,
}: UpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md transition-all duration-300 ease-out ${
        isAnimating
          ? "transform translate-y-0 opacity-100 scale-100"
          : "transform translate-y-full opacity-0 scale-95"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-2xl border border-blue-500/20 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          {/* Update Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-100 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-white">
                New Update Available!
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-blue-100">
                Fresh
              </span>
            </div>
            <p className="text-sm text-blue-100 mt-1 leading-relaxed">
              Get the latest features, improvements, and bug fixes.
            </p>
            {version && (
              <p className="text-xs text-blue-200 mt-1 opacity-75">
                Version: {version}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-3">
              <button
                onClick={onUpdate}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Update Now
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-blue-100 hover:text-white hover:bg-blue-500/30 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Later
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-blue-200 hover:text-white transition-colors duration-200 p-1 hover:bg-blue-500/30 rounded-lg"
            aria-label="Dismiss update notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-2 h-1 bg-blue-200/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-300 to-blue-100 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
