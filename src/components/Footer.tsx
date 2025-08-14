"use client";

import React from "react";
import Link from "next/link";
import { Github, Heart, MapPin, Train, AlertCircle, Map, Download, Shield, Mail, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { STATIONS } from '@/constants/stations';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations();
  const locale = useLocale();

  // Group stations by region
  const nycStations = ['WTC', 'CHR', '09S', '14S', '23S', '33S'];
  const njStations = ['NWK', 'HAR', 'JSQ', 'GRV', 'NEW', 'EXP', 'HOB'];

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      {/* Desktop Footer - Multi-column layout */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 justify-items-center">
            {/* Stations Column */}
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-4 flex items-center justify-center gap-2">
                <Train className="h-4 w-4" />
                {t('footer.sections.stations')}
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">New York</p>
                  <ul className="space-y-1">
                    {nycStations.map(stationId => (
                      <li key={stationId}>
                        <Link
                          href={`/${locale}/stations/${stationId}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {STATIONS[stationId as keyof typeof STATIONS]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">New Jersey</p>
                  <ul className="space-y-1">
                    {njStations.map(stationId => (
                      <li key={stationId}>
                        <Link
                          href={`/${locale}/stations/${stationId}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {STATIONS[stationId as keyof typeof STATIONS]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Features Column */}
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-4 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('footer.sections.features')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.realTimeTracking')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/service-maps`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.serviceMaps')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}#alerts`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.serviceAlerts')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}#stations`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.multiStation')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}#closest`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.closestStation')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Routes Column */}
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-4 flex items-center justify-center gap-2">
                <Map className="h-4 w-4" />
                {t('footer.sections.popularRoutes')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/stations/WTC`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.wtcToNewark')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/stations/33S`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.midtownToJersey')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/stations/HOB`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.hobokenToManhattan')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/service-maps`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.weekendService')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/service-maps`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.lateNightService')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-4 flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                {t('footer.sections.resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/add-to-home-screen`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.installGuide')}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/disclaimer`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.disclaimer')}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.panynj.gov/path"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {t('footer.links.officialPath')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="/api/status"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.apiStatus')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="text-center">
              <h3 className="font-semibold text-sm mb-4 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                {t('footer.sections.connect')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:livepathtracker@gmail.com"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.contact')}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('footer.links.reportIssue')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center md:items-start space-y-2">
                <p className="text-sm text-foreground">
                  {t('footer.copyright', { year: currentYear })}
                </p>
                <p className="text-sm text-muted-foreground italic">
                  {t('footer.tagline')}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span dangerouslySetInnerHTML={{ __html: t.raw('footer.madeBy') }} />
                </div>
                {/* Buy Me A Coffee Button */}
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
              <div className="text-xs text-muted-foreground text-center md:text-right">
                {t('footer.dataSource')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer - Keep existing simple layout */}
      <div className="md:hidden mx-auto max-w-4xl px-4 py-8">
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
