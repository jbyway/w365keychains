function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

async function runSmartLink() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    return window.location.href = "https://windows.cloud.microsoft.com";
  }

  const configUrl =
    `https://raw.githubusercontent.com/yourusername/smartlink/main/routes/${slug}.json`;

  let config;

  try {
    const res = await fetch(configUrl, { cache: "no-store" });
    config = await res.json();
  } catch (err) {
    console.error("Failed to load config", err);
    return window.location.href = "https://windows.cloud.microsoft.com";
  }

  const platform = getPlatform();

  switch (platform) {
    case "android":
      return openAndroid(config.android);
    case "ios":
      return openIOS(config.ios);
    default:
      return openDesktop(config.desktop);
  }
}

function openAndroid(cfg) {
  const scheme = cfg.scheme || "windowsapp";
  const pkg = cfg.package || "com.microsoft.windowsapp";
  const fallback = cfg.fallback || "https://windows.cloud.microsoft.com";

  const intentUrl =
    `intent://#Intent;scheme=${scheme};package=${pkg};` +
    `S.browser_fallback_url=${encodeURIComponent(fallback)};end`;

  window.location.href = intentUrl;
}

function openIOS(cfg) {
  const app = cfg.app || "windowsapp://";
  const fallback = cfg.fallback || "https://windows.cloud.microsoft.com";

  window.location.href = app;

  setTimeout(() => {
    window.location.href = fallback;
  }, 1000);
}

function openDesktop(url) {
  window.location.href = url || "https://windows.cloud.microsoft.com";
}

document.addEventListener("DOMContentLoaded", runSmartLink);

