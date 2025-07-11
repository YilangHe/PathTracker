"use client";

import React from "react";
import { Github, Heart } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Copyright and Creator Info */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <p className="text-sm text-foreground">
              {t('footer.copyright', { year: currentYear })}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span dangerouslySetInnerHTML={{ __html: t.raw('footer.madeBy') }} />
            </div>
            {/* Custom Buy Me A Coffee Button */}
            <div className="mt-3">
              <a
                href="https://www.buymeacoffee.com/himrnoodles"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center font-medium text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{
                  backgroundColor: "rgb(95, 127, 255)",
                  color: "rgb(255, 255, 255)",
                }}
              >
                <div className="flex">
                  <span
                    className="inline-block"
                    style={{ transform: "scale(0.8)", marginTop: "-2px" }}
                  >
                    🚆
                  </span>
                  <span className="ml-2">{t('footer.buyMeCoffee')}</span>
                </div>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border"></div>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-2 sm:space-y-0">
            <div className="text-xs text-muted-foreground">
              {t('footer.dataSource')}
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <a
                href={`/${locale}/disclaimer`}
                className="hover:text-foreground transition-colors"
              >
                {t('footer.disclaimer')}
              </a>
              <span>•</span>
              <a
                href="mailto:livepathtracker@gmail.com"
                className="hover:text-foreground transition-colors"
              >
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
