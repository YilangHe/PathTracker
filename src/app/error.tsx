"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl p-4 min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
            Something went wrong
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            An error occurred while loading the page
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            We're sorry for the inconvenience. Please try refreshing the page or
            return to the home page.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="mr-2">🔄</span>
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="mr-2">🚊</span>
              Go to PATH Tracker
            </Link>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              If this problem persists, please check your internet connection
            </p>
            <p>or try again in a few minutes.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Error ID: {error.digest}</p>
            <p>If you continue to experience issues, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
