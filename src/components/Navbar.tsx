"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useGeolocation } from "@/hooks/useGeolocation";
import { DesktopSettingsDropdown } from "@/components/DesktopSettingsDropdown";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { Tooltip } from "@/components/ui/tooltip";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export function Navbar() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const { hasPermission } = useGeolocation();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await installPWA();
      if (!success) {
        // If programmatic install fails, navigate to instructions
        router.push(`/${locale}/add-to-home-screen`);
      }
    } else {
      // If not installable, show instructions
      router.push(`/${locale}/add-to-home-screen`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-600 shadow-lg">
      <div className="container max-w-4xl mx-auto flex h-16 sm:h-14 items-center px-4 lg:px-6">
        <div className="mr-4 flex">
          <Link
            href={`/${locale}`}
            className="mr-6 flex items-center space-x-2"
          >
            <Image
              src="/logo.png"
              alt="PATH Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="hidden font-bold md:inline-block text-white">
              {t("nav.title")}
            </span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="hidden md:block">
              <NavigationMenuTrigger className="text-white hover:text-white/90 data-[active]:text-white data-[state=open]:text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 px-3 py-2 rounded-md transition-colors min-h-[44px] touch-manipulation">
                {t("nav.features")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[320px] sm:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-popover border border-border shadow-lg rounded-md">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 no-underline outline-none focus:shadow-md hover:from-primary/10 hover:to-primary/20 dark:hover:from-primary/20 dark:hover:to-primary/30 transition-colors"
                        href={`/${locale}`}
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-primary">
                          {t("nav.realTimeArrivals")}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {t("nav.realTimeArrivalsDesc")}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href={`/${locale}`}
                    title={t("nav.multiStationView")}
                  >
                    {t("nav.multiStationViewDesc")}
                  </ListItem>
                  <ListItem href={`/${locale}`} title={t("nav.dragAndDrop")}>
                    {t("nav.dragAndDropDesc")}
                  </ListItem>
                  <ListItem href={`/${locale}`} title={t("nav.serviceAlerts")}>
                    {t("nav.serviceAlertsDesc")}
                  </ListItem>
                  <ListItem
                    href={`/${locale}/service-maps`}
                    title={t("nav.serviceMaps")}
                  >
                    {t("nav.serviceMapsDesc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:text-white/90 data-[active]:text-white data-[state=open]:text-white bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 px-3 py-2 rounded-md transition-colors min-h-[44px] touch-manipulation">
                {t("nav.about")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-3 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover border border-border shadow-lg rounded-md">
                  <ListItem
                    title={t("nav.aboutPath")}
                    href="https://www.panynj.gov/path"
                  >
                    {t("nav.aboutPathDesc")}
                  </ListItem>
                  <ListItem
                    title={t("nav.dataSource")}
                    href="https://www.panynj.gov/path/en/schedules-maps.html"
                  >
                    {t("nav.dataSourceDesc")}
                  </ListItem>
                  <ListItem
                    title={t("nav.addToHomeScreen")}
                    href={`/${locale}/add-to-home-screen`}
                  >
                    {t("nav.addToHomeScreenDesc")}
                  </ListItem>
                  <ListItem
                    title={t("nav.disclaimer")}
                    href={`/${locale}/disclaimer`}
                  >
                    {t("nav.disclaimerDesc")}
                  </ListItem>
                  <ListItem title={t("nav.privacy")} href={`/${locale}`}>
                    {t("nav.privacyDesc")}
                  </ListItem>
                  <ListItem
                    title={t("nav.contact")}
                    href="mailto:livepathtracker@gmail.com"
                  >
                    {t("nav.contactDesc")}
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href={`/${locale}/service-maps`}
                  className="text-white hover:text-white/90 data-[active]:text-white bg-transparent hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-sm font-medium inline-flex items-center min-h-[44px] touch-manipulation"
                >
                  <span className="hidden md:inline">
                    {t("nav.serviceMaps")}
                  </span>
                  <span className="md:hidden">{t("nav.serviceMapsShort")}</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Desktop/Tablet: Unified settings dropdown */}
          <div className="hidden sm:flex items-center">
            <DesktopSettingsDropdown />
          </div>
          {/* Mobile: Combined settings dropdown */}
          <div className="sm:hidden">
            <SettingsDropdown />
          </div>
          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center h-11 sm:h-9 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 border border-white/20 hover:border-white/30 touch-manipulation"
              aria-label={isInstallable ? t("nav.installApp") : t("nav.installGuide")}
            >
              <svg
                className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <span className="hidden sm:inline ml-1">
                {isInstallable ? t("nav.installAppShort") : "Install"}
              </span>
              <span className="sm:hidden ml-1.5 text-xs">
                Install
              </span>
            </button>
          )}
          {isInstalled && (
            <Tooltip
              content={t("nav.appInstalled")}
              position="bottom"
            >
              <div className="inline-flex items-center justify-center h-9 w-9 text-green-600 bg-green-50 border border-green-200 rounded-md">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
