"use client";

import React, { useState, useRef, useEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const themes = [
    {
      name: "Light",
      value: "light" as const,
      icon: Sun,
      description: "Light mode",
    },
    {
      name: "Dark",
      value: "dark" as const,
      icon: Moon,
      description: "Dark mode",
    },
    {
      name: "System",
      value: "system" as const,
      icon: Monitor,
      description: "System preference",
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeSelect = (newTheme: typeof theme) => {
    setTheme(newTheme);
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
    <div ref={containerRef} className="relative group">
      {/* Toggle Button */}
      <button
        onClick={handleToggleClick}
        className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Current theme: ${currentTheme.name}. Click to change theme.`}
        title={currentTheme.description}
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-36 rounded-md border bg-popover text-popover-foreground shadow-md transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        } group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto`}
      >
        <div className="p-1">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;

            return (
              <button
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                }`}
                role="menuitem"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left">{themeOption.name}</span>
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
