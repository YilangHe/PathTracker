"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface ServiceMapsViewerProps {
  className?: string;
}

type MapType = "weekdays" | "weeknights" | "weekends";

const mapImages = {
  weekdays: "/ServiceMaps/weekdays.jpg",
  weeknights: "/ServiceMaps/weeknights.jpg",
  weekends: "/ServiceMaps/weekends.jpg",
};

export function ServiceMapsViewer({ className = "" }: ServiceMapsViewerProps) {
  const t = useTranslations("serviceMaps");
  const [activeMap, setActiveMap] = useState<MapType>("weekdays");
  const [scale, setScale] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.5, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (scale <= 1) return;

      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPosX = x.get();
      const startPosY = y.get();

      // Change cursor to grabbing and prevent page scrolling
      setIsDragging(true);
      document.body.style.cursor = "grabbing";
      document.body.style.overflow = "hidden";

      const handleMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();

        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const imageWidth = containerRect.width * scale;
        const imageHeight = containerRect.height * scale;

        const maxX = Math.max(0, (imageWidth - containerRect.width) / 2);
        const maxY = Math.max(0, (imageHeight - containerRect.height) / 2);

        const newX = Math.max(-maxX, Math.min(maxX, startPosX + deltaX));
        const newY = Math.max(-maxY, Math.min(maxY, startPosY + deltaY));

        x.set(newX);
        y.set(newY);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsDragging(false);
        document.body.style.userSelect = "auto";
        document.body.style.cursor = "auto";
        document.body.style.overflow = "auto";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    },
    [scale, x, y]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      if (scale <= 1) return;

      const touch = event.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      const startPosX = x.get();
      const startPosY = y.get();
      let hasMoved = false;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length !== 1) return;

        const touch = moveEvent.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        // Only prevent page scrolling once we detect actual movement
        if (!hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
          hasMoved = true;
          setIsDragging(true);
          moveEvent.preventDefault();
          moveEvent.stopPropagation();
          document.body.style.overflow = "hidden";
          document.body.style.touchAction = "none";
        }

        if (hasMoved) {
          moveEvent.preventDefault();
          moveEvent.stopPropagation();

          const container = containerRef.current;
          if (!container) return;

          const containerRect = container.getBoundingClientRect();
          const imageWidth = containerRect.width * scale;
          const imageHeight = containerRect.height * scale;

          const maxX = Math.max(0, (imageWidth - containerRect.width) / 2);
          const maxY = Math.max(0, (imageHeight - containerRect.height) / 2);

          const newX = Math.max(-maxX, Math.min(maxX, startPosX + deltaX));
          const newY = Math.max(-maxY, Math.min(maxY, startPosY + deltaY));

          x.set(newX);
          y.set(newY);
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);

        // Restore page scrolling
        setIsDragging(false);
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    },
    [scale, x, y]
  );

  const handleMapChange = useCallback((mapType: MapType) => {
    setActiveMap(mapType);
    setImageLoaded(false);
    setImageError(false);
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(4, prev * delta)));
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Disable page scrolling when mouse enters the map
    document.body.style.overflow = "hidden";
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Re-enable page scrolling when mouse leaves the map
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    if (scale === 1) {
      x.set(0);
      y.set(0);
    }
  }, [scale, x, y]);

  // Cleanup effect to restore scrolling and cursor
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "auto";
      document.body.style.touchAction = "auto";
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Selection Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
        {Object.keys(mapImages).map((mapType) => (
          <button
            key={mapType}
            onClick={() => handleMapChange(mapType as MapType)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
              activeMap === mapType
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
            }`}
          >
            {t(mapType as keyof typeof mapImages)}
          </button>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between gap-2 p-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md bg-background hover:bg-muted-foreground/10 transition-colors touch-manipulation"
            disabled={scale <= 0.5}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="text-sm font-mono min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md bg-background hover:bg-muted-foreground/10 transition-colors touch-manipulation"
            disabled={scale >= 4}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={handleResetZoom}
          className="px-3 py-2 text-sm rounded-md bg-background hover:bg-muted-foreground/10 transition-colors touch-manipulation"
        >
          {t("resetZoom")}
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-[400px] sm:h-[500px] lg:h-[600px] border rounded-lg overflow-hidden bg-muted ${
          scale > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
        style={{ touchAction: scale > 1 ? "none" : "auto" }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={imageRef}
          className="w-full h-full flex items-center justify-center"
          style={{
            scale,
            x,
            y,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {!imageLoaded && !imageError && (
            <div className="flex items-center justify-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2"></div>
              {t("loading")}
            </div>
          )}

          {imageError && (
            <div className="flex items-center justify-center text-destructive">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              {t("error")}
            </div>
          )}

          <Image
            src={mapImages[activeMap]}
            alt={`PATH ${t(activeMap)} service map`}
            fill
            className={`object-contain transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority
          />
        </motion.div>
      </div>

      {/* Help Text */}
      <div className="text-sm text-muted-foreground text-center space-y-2">
        <p>{t("description")}</p>
        <p className="text-xs">
          <span className="hidden sm:inline">Use mouse wheel to zoom. </span>
          <span className="sm:hidden">Pinch to zoom on mobile. </span>
          {scale > 1 && "Drag to pan around the map."}
        </p>
      </div>
    </div>
  );
}
