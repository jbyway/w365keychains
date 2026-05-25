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

// --- CONFIG (using your exact values) ---
const config = {
  android: {
    scheme: "windowsapp",
    package: "com.microsoft.rdc.androidx",
    fallback: "https://windows.cloud.microsoft"
  },
  ios: {
    app: "windowsapp://",
    fallback: "https://windows.cloud.microsoft"
  },
  desktop: "https://windows.cloud.microsoft",
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
    `Intent URL:<br><small>${intentUrl}</small>`
  );

  // --- BUTTON HANDLERS (Edge-safe: direct navigation only) ---
  document.getElementById("launchApp").onclick = () => {
    window.location.href = intentUrl;
  };

  document.getElementById("launchWeb").onclick = () => {
    window.location.href = config.android.fallback;
  };

  document.getElementById("launchDocs").onclick = () => {
    window.location.href = config.docs;
  };

  // --- AUTO-BEHAVIOR FOR iOS ---
  if (platform === "ios") {
    window.location.href = config.ios.app;

    setTimeout(() => {
      window.location.href = config.ios.fallback;
    }, 1200);
  }

  // --- AUTO-BEHAVIOR FOR DESKTOP ---
  if (platform === "desktop") {
    window.location.href = config.desktop;
  }
});

