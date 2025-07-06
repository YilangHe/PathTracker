import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function AddToHomeScreenPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Add Path Tracker to Your Home Screen
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 1: Open the Share Menu
              </h2>
              <p className="text-gray-600 mb-4">
                While viewing Path Tracker in your browser, tap the share button
                at the bottom of your screen (Safari) or in the browser menu.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 2: Find "Add to Home Screen"
              </h2>
              <p className="text-gray-600 mb-4">
                Look for the "Add to Home Screen" option in the share menu. You
                may need to scroll down to find it.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Step 3: Confirm Installation
              </h2>
              <p className="text-gray-600 mb-4">
                Tap "Add to Home Screen" and then confirm by tapping "Add" in
                the popup dialog. The app will now appear on your home screen!
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
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

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          Why Add to Home Screen?
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>Instant access to real-time PATH arrivals</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>No need to remember the website URL</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>Faster loading and better performance</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span>Works offline for previously viewed stations</span>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Path Tracker
        </a>
      </div>
    </div>
  );
}
