import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl p-4 min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Sorry, we couldn't find the page you're looking for. The page may
            have been moved, deleted, or doesn't exist.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <span className="mr-2">🚊</span>
            Go to PATH Tracker
          </Link>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Looking for real-time PATH train arrivals?</p>
            <p>Track trains across New York and New Jersey</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>If you believe this is an error, please check the URL or</p>
            <p>contact us if the problem persists.</p>
          </div>
        </div>
      </div>
    </div>
  );
}