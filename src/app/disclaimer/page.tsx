import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Path Tracker",
  description:
    "Important legal information and data sources for Path Tracker app. Learn about our data sources and terms of use.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Disclaimer - Path Tracker",
    description:
      "Important legal information and data sources for Path Tracker app",
    url: "https://www.livepathtracker.com/disclaimer",
  },
  twitter: {
    card: "summary",
    title: "Disclaimer - Path Tracker",
    description:
      "Important legal information and data sources for Path Tracker app",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <div className="max-w-3xl mx-auto py-8">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Disclaimer
        </h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg dark:bg-primary/10">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Important Notice
            </h2>
            <p className="text-foreground leading-relaxed">
              Path Tracker is an independent platform developed to help PATH
              train riders access real-time schedules and updates conveniently.
              This site is not affiliated with or endorsed by the Port Authority
              of New York and New Jersey (PANYNJ) or any official PATH services.
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg dark:bg-amber-950/20 dark:border-amber-400">
            <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">
              Accuracy of Information
            </h2>
            <p className="text-foreground leading-relaxed">
              While every effort is made to ensure the accuracy of the
              information provided on Path Tracker, schedules and updates are
              subject to change, and real-time data may vary. Users are
              encouraged to verify critical travel details through official
              sources and use Path Tracker as a complementary tool for trip
              planning.
            </p>
          </div>

          <div className="bg-muted/30 border-l-4 border-muted-foreground/50 p-6 rounded-r-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Official PATH Resources
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              For the most up-to-date and official information, please visit:
            </p>
            <ul className="space-y-2 text-foreground">
              <li>
                •{" "}
                <a
                  href="https://www.panynj.gov/path"
                  className="text-primary hover:text-primary/80 underline"
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
                  className="text-primary hover:text-primary/80 underline"
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
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
