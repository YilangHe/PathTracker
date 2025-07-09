import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add to Home Screen - Path Tracker",
  description:
    "Learn how to add Path Tracker to your home screen for quick access to real-time PATH train arrivals. Step-by-step installation guide for iOS and Android.",
  alternates: {
    canonical: "/add-to-home-screen",
  },
  openGraph: {
    title: "Add Path Tracker to Home Screen",
    description:
      "Get quick access to PATH train arrivals - Add to your home screen in 3 easy steps",
    url: "https://www.livepathtracker.com/add-to-home-screen",
    images: [
      {
        url: "/AddToHomeScreenInstructions/step_1.jpg",
        width: 250,
        height: 400,
        alt: "Add to Home Screen Instructions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Path Tracker to Home Screen",
    description:
      "Get quick access to PATH train arrivals - Add to your home screen in 3 easy steps",
    images: ["/AddToHomeScreenInstructions/step_1.jpg"],
  },
};

export default function AddToHomeScreenPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Add Path Tracker to Your Home Screen",
            description:
              "Step-by-step guide to install Path Tracker as a PWA on your mobile device for quick access to real-time PATH train arrivals",
            image:
              "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_1.jpg",
            totalTime: "PT2M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: "0",
            },
            tool: [
              {
                "@type": "HowToTool",
                name: "Mobile web browser (Safari, Chrome, Firefox)",
              },
            ],
            step: [
              {
                "@type": "HowToStep",
                name: "Open the Share Menu",
                text: "While viewing Path Tracker in your browser, tap the share button at the bottom of your screen (Safari) or in the browser menu.",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_1.jpg",
              },
              {
                "@type": "HowToStep",
                name: "Find Add to Home Screen",
                text: "Look for the 'Add to Home Screen' option in the share menu. You may need to scroll down to find it.",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_2.jpg",
              },
              {
                "@type": "HowToStep",
                name: "Confirm Installation",
                text: "Tap 'Add to Home Screen' and then confirm by tapping 'Add' in the popup dialog. The app will now appear on your home screen!",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_3.jpg",
              },
            ],
          }),
        }}
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Add Path Tracker to Your Home Screen
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get quick access to real-time PATH train arrivals by adding this app
          to your home screen. Follow these simple steps to install the app on
          your device.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Step 1: Open the Share Menu
              </h2>
              <p className="text-foreground mb-4">
                While viewing Path Tracker in your browser, tap the share button
                at the bottom of your screen (Safari) or in the browser menu.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• On Safari: Tap the share icon at the bottom center</li>
                <li>• On Chrome: Tap the three-dot menu, then "Share"</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image
                src="/AddToHomeScreenInstructions/step_1.jpg"
                alt="Step 1: Open the Share Menu"
                width={250}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="md:order-2">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Step 2: Find "Add to Home Screen"
              </h2>
              <p className="text-foreground mb-4">
                Look for the "Add to Home Screen" option in the share menu. You
                may need to scroll down to find it.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• The option shows a plus (+) icon next to it</li>
                <li>• If you don't see it, try scrolling down in the menu</li>
              </ul>
            </div>
            <div className="flex justify-center md:order-1">
              <Image
                src="/AddToHomeScreenInstructions/step_2.jpg"
                alt="Step 2: Find Add to Home Screen option"
                width={250}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Step 3: Confirm Installation
              </h2>
              <p className="text-foreground mb-4">
                Tap "Add to Home Screen" and then confirm by tapping "Add" in
                the popup dialog. The app will now appear on your home screen!
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You can customize the app name before adding</li>
                <li>• The app will work like a native app once installed</li>
                <li>• Access it anytime from your home screen</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image
                src="/AddToHomeScreenInstructions/step_3.jpg"
                alt="Step 3: Confirm Installation"
                width={250}
                height={400}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg">
        <h3 className="text-xl font-semibold text-primary mb-3">
          Why Add to Home Screen?
        </h3>
        <ul className="text-foreground space-y-2">
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>Instant access to real-time PATH arrivals</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>No need to remember the website URL</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>Faster loading and better performance</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">✓</span>
            <span>Works offline for previously viewed stations</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Back to Path Tracker
        </a>
      </div>
    </div>
  );
}
