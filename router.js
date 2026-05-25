// --- STATUS DISPLAY ---
function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}

// --- DEVICE DETECTION ---
function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

// --- DEFAULT CONFIG ---
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
  desktop: "https://windows.cloud.microsoft"
};

// --- MAIN ROUTER ---
function runSmartLink() {
  setStatus("Detecting platform…");

  const platform = getPlatform();
  setStatus(`Platform detected: ${platform}`);

  switch (platform) {
    case "android":
      return prepareAndroid(config.android);
    case "ios":
      return openIOS(config.ios);
    default:
      return openDesktop(config.desktop);
  }
}

// --- ANDROID: ADD PAUSE + CLEAR INTENT ---
function prepareAndroid(cfg) {
  let countdown = 2;

  setStatus(`Opening Windows App in ${countdown} seconds…`);

  const timer = setInterval(() => {
    countdown -= 1;

    if (countdown > 0) {
      setStatus(`Opening Windows App in ${countdown} second…`);
    } else {
      clearInterval(timer);
      openAndroid(cfg);
    }
  }, 1000);
}

function openAndroid(cfg) {
  const intentUrl =
    `intent://#Intent;scheme=${cfg.scheme};package=${cfg.package};` +
    `S.browser_fallback_url=${encodeURIComponent(cfg.fallback)};end`;

  setStatus("Preparing to launch Windows App…");

  let countdown = 2;

  const timer = setInterval(() => {
    countdown -= 1;

    if (countdown > 0) {
      setStatus(`Opening Windows App in ${countdown} second…`);
    } else {
      clearInterval(timer);               // ⭐ FIXED
      setStatus("Launching now…");
      window.location.href = intentUrl;   // ⭐ SAFE REDIRECT
    }
  }, 1000);

  // Show intent URL once (for debugging)
  console.log("Intent URL:", intentUrl);
}



// --- iOS HANDLER ---
function openIOS(cfg) {
  setStatus("Launching Windows App on iOS…");

  window.location.href = cfg.app;

  setStatus("Waiting to see if app opens…");

  setTimeout(() => {
    setStatus("App did not open, redirecting to fallback…");
    window.location.href = cfg.fallback;
  }, 1000);
}

// --- DESKTOP HANDLER ---
function openDesktop(url) {
  setStatus("Redirecting desktop user…");
  window.location.href = url;
}

// --- AUTO-RUN ---
document.addEventListener("DOMContentLoaded", runSmartLink);

