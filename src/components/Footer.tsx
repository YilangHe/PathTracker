import React from "react";
import { Github, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Copyright and Creator Info */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <p className="text-sm text-foreground">
              © {currentYear} Path Tracker. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground italic">
              By the Path rider, for the path rider
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span>by</span>
              <a
                href="https://github.com/YilangHe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>@Noodles</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border"></div>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0">
            <div className="text-xs text-muted-foreground">
              Data © Port Authority of NY & NJ • Updates every 10s
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <a
                href="/disclaimer"
                className="hover:text-foreground transition-colors"
              >
                Disclaimer
              </a>
              <span>•</span>
              <a
                href="mailto:livepathtracker@gmail.com"
                className="hover:text-foreground transition-colors"
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
