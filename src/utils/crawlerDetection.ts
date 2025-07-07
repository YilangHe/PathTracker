// Robust crawler detection utility
export const isCrawler = (): boolean => {
  // TEMPORARY: Force disable crawler detection for testing
  // Remove this line once you've verified the fix works
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    console.log("🧪 Crawler detection disabled for localhost testing");
    return false;
  }

  // Server-side rendering
  if (typeof window === "undefined") {
    console.log("🤖 Crawler detected: SSR environment");
    return true;
  }

  // Check for headless browsers and crawlers
  if (typeof navigator === "undefined") {
    console.log("🤖 Crawler detected: No navigator object");
    return true;
  }

  const userAgent = navigator.userAgent?.toLowerCase() || "";
  console.log("🔍 User Agent:", userAgent);

  // Known crawler user agents
  const crawlerPatterns = [
    "googlebot",
    "bingbot",
    "slurp",
    "duckduckbot",
    "baiduspider",
    "yandexbot",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "developers.google.com/+/web/snippet",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "redditbot",
    "applebot",
    "whatsapp",
    "flipboard",
    "tumblr",
    "bitlybot",
    "skypeuripreview",
    "nuzzel",
    "discordbot",
    "google page speed",
    "qwantify",
    "pinterestbot",
    "bitrix link preview",
    "xing-contenttabreceiver",
    "chrome-lighthouse",
    "headlesschrome",
  ];

  // Check if user agent matches any crawler pattern
  const matchedPattern = crawlerPatterns.find((pattern) =>
    userAgent.includes(pattern)
  );
  if (matchedPattern) {
    console.log(
      "🤖 Crawler detected: User agent matches pattern:",
      matchedPattern
    );
    return true;
  }

  // Check for headless Chrome (often used by crawlers)
  if (
    userAgent.includes("headlesschrome") ||
    (userAgent.includes("chrome") && userAgent.includes("headless"))
  ) {
    console.log("🤖 Crawler detected: Headless Chrome");
    return true;
  }

  // Check for missing properties that real browsers have
  if (!navigator.languages || navigator.languages.length === 0) {
    console.log("🤖 Crawler detected: No languages array");
    return true;
  }

  // Check for webdriver (automated browsers)
  if ("webdriver" in navigator || (window as any).webdriver) {
    console.log("🤖 Crawler detected: WebDriver detected");
    return true;
  }

  // Check for phantom/headless indicators
  if (
    (window as any).phantom ||
    (window as any)._phantom ||
    (window as any).callPhantom
  ) {
    console.log("🤖 Crawler detected: Phantom indicators");
    return true;
  }

  // Check for automated testing tools
  if ((window as any).Buffer || (window as any).emit || (window as any).spawn) {
    console.log("🤖 Crawler detected: Node.js globals detected");
    return true;
  }

  // Additional checks for crawler behavior
  try {
    // Real browsers usually have these properties
    if (
      !("plugins" in navigator) ||
      !(navigator as any).plugins ||
      (navigator as any).plugins.length === 0
    ) {
      // This is too aggressive - many legitimate browsers have no plugins
      console.log("⚠️  No plugins detected, but not marking as crawler");
    }

    // Check screen properties (crawlers often have unusual screen settings)
    if (screen.width === 0 || screen.height === 0) {
      console.log("🤖 Crawler detected: Zero screen dimensions");
      return true;
    }

    // Check for minimal viewport (common in crawlers) - but be less aggressive
    if (window.innerWidth <= 50 || window.innerHeight <= 50) {
      console.log("🤖 Crawler detected: Extremely small viewport");
      return true;
    }
  } catch (e) {
    // If we can't access these properties, likely a crawler
    console.log("🤖 Crawler detected: Cannot access screen properties");
    return true;
  }

  // Additional behavioral check: real users typically have interaction capabilities
  // This is a lightweight check that doesn't affect performance
  const hasInteractionCapabilities =
    "ontouchstart" in window || "onmousedown" in window;
  if (!hasInteractionCapabilities) {
    console.log("🤖 Crawler detected: No interaction capabilities");
    return true;
  }

  console.log("👤 Real user detected");
  return false;
};

// Cache the result to avoid repeated checks
let cachedResult: boolean | null = null;

export const isCrawlerCached = (): boolean => {
  if (cachedResult === null) {
    cachedResult = isCrawler();
  }
  return cachedResult;
};
