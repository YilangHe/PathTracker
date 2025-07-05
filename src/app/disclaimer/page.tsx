import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Path Tracker",
  description:
    "Important legal information and data sources for Path Tracker app",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <div className="max-w-3xl mx-auto py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8">Disclaimer</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Important Notice
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Path Tracker is an independent platform developed to help PATH
              train riders access real-time schedules and updates conveniently.
              This site is not affiliated with or endorsed by the Port Authority
              of New York and New Jersey (PANYNJ) or any official PATH services.
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">
              Accuracy of Information
            </h2>
            <p className="text-gray-800 leading-relaxed">
              While every effort is made to ensure the accuracy of the
              information provided on MyPath, schedules and updates are subject
              to change, and real-time data may vary. Users are encouraged to
              verify critical travel details through official sources and use
              MyPath as a complementary tool for trip planning.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Official PATH Resources
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              For the most up-to-date and official information, please visit:
            </p>
            <ul className="space-y-2 text-gray-800">
              <li>
                •{" "}
                <a
                  href="https://www.panynj.gov/path"
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official PATH Website
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="https://www.panynj.gov/path/en/schedules-maps.html"
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PATH Schedules and Maps
                </a>
              </li>
              <li>• Official PATH mobile app</li>
              <li>• Station announcements and displays</li>
            </ul>
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
