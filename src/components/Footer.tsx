import React from "react";
import { Github, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Copyright and Creator Info */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Path Tracker. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 italic">
              By the Path rider, for the path rider
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by</span>
              <a
                href="https://github.com/YilangHe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>@Noodles</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-200"></div>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-500">
              Data © Port Authority of NY & NJ • Updates every 10s
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <a
                href="/disclaimer"
                className="hover:text-gray-700 transition-colors"
              >
                Disclaimer
              </a>
              <span>•</span>
              <a
                href="mailto:livepathtracker@gmail.com"
                className="hover:text-gray-700 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
