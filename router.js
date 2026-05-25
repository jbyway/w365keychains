// --- STATUS DISPLAY ---
function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.innerHTML = msg;
}

// --- DEVICE DETECTION ---
function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

// --- CONFIG (with Play Store fallback) ---
const config = {
  android: {
    scheme: "windowsapp://",
    package: "com.microsoft.rdc.androidx",
    fallback: "https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx"
  },
  ios: {
    app: "windowsapp://",
    fallback: "https://windows.cloud.microsoft.com"
  },
  desktop: "https://windows.cloud.microsoft.com",
  docs: "https://aka.ms/w365docs"
};

// --- BUILD INTENT URL ---
function buildIntentURL() {
  return (
    `intent://#Intent;scheme=${config.android.scheme};package=${config.android.package};` +
    `S.browser_fallback_url=${encodeURIComponent(config.android.fallback)};end`
  );
}

// --- MAIN LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  const platform = getPlatform();
  const intentUrl = buildIntentURL();

  // Show debug info
  setStatus(
    `Platform detected: ${platform}<br><br>` +
    `Intent URL: ${intentUrl}`
  );

  // --- BUTTON HANDLERS ---
  document.getElementById("launchApp").onclick = () => {
    setStatus("Launching Windows App…");
    window.location.href = intentUrl;
  };

  document.getElementById("launchWeb").onclick = () => {
    setStatus("Opening Web Client…");
    window.location.href = config.android.fallback;
  };

  document.getElementById("launchDocs").onclick = () => {
    setStatus("Opening Windows 365 Docs…");
    window.location.href = config.docs;
  };

  // --- AUTO-BEHAVIOR FOR iOS ---
  if (platform === "ios") {
    setStatus("Launching Windows App on iOS…");
    window.location.href = config.ios.app;

    setTimeout(() => {
      setStatus("App did not open, redirecting to Web Client…");
      window.location.href = config.ios.fallback;
    }, 1200);
  }

  // --- AUTO-BEHAVIOR FOR DESKTOP ---
  if (platform === "desktop") {
    setStatus("Redirecting desktop user to Web Client…");
    window.location.href = config.desktop;
  }
});


