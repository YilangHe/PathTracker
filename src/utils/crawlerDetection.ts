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

  // Known crawler user agents - keep this as the primary detection method
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

  // Check for webdriver (automated browsers) - keep this as it's reliable
  if ("webdriver" in navigator || (window as any).webdriver) {
    console.log("🤖 Crawler detected: WebDriver detected");
    return true;
  }

  // Check for phantom/headless indicators - keep this as it's reliable
  if (
    (window as any).phantom ||
    (window as any)._phantom ||
    (window as any).callPhantom
  ) {
    console.log("🤖 Crawler detected: Phantom indicators");
    return true;
  }

  // More conservative checks for crawler behavior
  try {
    // Only check for extremely obvious crawler indicators
    if (screen.width === 0 || screen.height === 0) {
      console.log("🤖 Crawler detected: Zero screen dimensions");
      return true;
    }

    // Only flag extremely small viewports (likely headless browsers)
    if (window.innerWidth <= 10 || window.innerHeight <= 10) {
      console.log("🤖 Crawler detected: Extremely small viewport");
      return true;
    }
  } catch (e) {
    // If we can't access screen properties, be more conservative
    console.log(
      "⚠️  Cannot access screen properties, but not marking as crawler"
    );
  }

  // Additional safety check: only flag if multiple suspicious indicators are present
  let suspiciousIndicators = 0;

  // Check for missing languages (but don't make it a hard fail)
  if (
    !(navigator as any).languages ||
    (navigator as any).languages.length === 0
  ) {
    console.log("⚠️  No languages array detected");
    suspiciousIndicators++;
  }

  // Check for Node.js globals (but don't make it a hard fail)
  if ((window as any).Buffer || (window as any).emit || (window as any).spawn) {
    console.log("⚠️  Node.js globals detected");
    suspiciousIndicators++;
  }

  // Check for missing interaction capabilities (but don't make it a hard fail)
  const hasInteractionCapabilities =
    "ontouchstart" in window || "onmousedown" in window || "onclick" in window;
  if (!hasInteractionCapabilities) {
    console.log("⚠️  No interaction capabilities detected");
    suspiciousIndicators++;
  }

  // Only flag as crawler if we have multiple suspicious indicators
  if (suspiciousIndicators >= 2) {
    console.log(
      `🤖 Crawler detected: Multiple suspicious indicators (${suspiciousIndicators})`
    );
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
