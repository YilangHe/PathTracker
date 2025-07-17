"use client";

import React, { useState, useRef, useEffect } from "react";
import { Settings, Monitor, Moon, Sun, Cloud, CloudOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, localeFlags } from '@/config/i18n';

export const DesktopSettingsDropdown: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { preferences, toggleWeatherWidget } = useUserPreferences();
  const { hasPermission } = useGeolocation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const themes = [
    { name: "Light", value: "light" as const, icon: Sun },
    { name: "Dark", value: "dark" as const, icon: Moon },
    { name: "System", value: "system" as const, icon: Monitor },
  ];

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme);
  };

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0] as any)) {
      segments.shift();
    }
    const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(newPath);
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleToggleClick}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md text-white hover:text-white/90 bg-transparent hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        aria-label="Settings menu"
        aria-expanded={isOpen}
      >
        <Settings className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="p-1">
          {/* Theme Section */}
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Theme
          </div>
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;
            return (
              <button
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{themeOption.name}</span>
                {isActive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-current" />
                )}
              </button>
            );
          })}

          {/* Weather Section - Only show if geolocation permission is granted */}
          {hasPermission && (
            <>
              {/* Divider */}
              <div className="my-1 h-px bg-border" />

              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Weather
              </div>
              <button
                onClick={toggleWeatherWidget}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-foreground"
              >
                {preferences.showWeatherWidget ? (
                  <Cloud className="mr-3 h-4 w-4" />
                ) : (
                  <CloudOff className="mr-3 h-4 w-4" />
                )}
                <span className="flex-1 text-left">
                  {preferences.showWeatherWidget ? "Hide Weather" : "Show Weather"}
                </span>
              </button>
            </>
          )}

          {/* Divider */}
          <div className="my-1 h-px bg-border" />

          {/* Language Section */}
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Language
          </div>
          {locales.map((loc) => {
            const isActive = locale === loc;
            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                }`}
              >
                <span className="mr-3 text-lg">{localeFlags[loc]}</span>
                <span className="flex-1 text-left">{localeNames[loc]}</span>
                {isActive && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};