function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}

function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

async function runSmartLink() {
  setStatus("Loading configuration…");

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    setStatus("No slug provided, redirecting to fallback…");
    return window.location.href = "https://windows.cloud.microsoft";
  }

  const configUrl =
    `https://raw.githubusercontent.com/jbyway/w365keychains/main/routes/${slug}.json`;

  let config;

  try {
    const res = await fetch(configUrl, { cache: "no-store" });
    config = await res.json();
    setStatus("Configuration loaded.");
  } catch (err) {
    setStatus("Failed to load config, using fallback…");
    return window.location.href = "https://windows.cloud.microsoft";
  }

  const platform = getPlatform();
  setStatus(`Detected platform: ${platform}`);

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
  setStatus("Launching Windows App on Android…");

  const scheme = cfg.scheme || "windowsapp://";
  const pkg = cfg.package || "com.microsoft.rdc.androidx";
  const fallback = cfg.fallback || "https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx";

  const intentUrl =
    `intent://#Intent;scheme=${scheme};package=${pkg};` +
    `S.browser_fallback_url=${encodeURIComponent(fallback)};end`;

  setStatus("Opening intent URL…");
  window.location.href = intentUrl;
}

function openIOS(cfg) {
  setStatus("Launching Windows App on iOS…");

  const app = cfg.app || "windowsapp://";
  const fallback = cfg.fallback || "https://windows.cloud.microsoft";

  window.location.href = app;

  setStatus("Waiting to see if app opens…");

  setTimeout(() => {
    setStatus("App did not open, redirecting to fallback…");
    window.location.href = fallback;
  }, 1000);
}

function openDesktop(url) {
  setStatus("Redirecting desktop user…");
  window.location.href = url || "https://windows.cloud.microsoft";
}

document.addEventListener("DOMContentLoaded", runSmartLink);

