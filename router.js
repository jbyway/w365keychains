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

function prepareAndroid(cfg) {
  // No countdown here anymore
  // Just hand off to openAndroid()
  openAndroid(cfg);
}


function openAndroid(cfg) {
  const intentUrl =
    `intent://#Intent;scheme=${cfg.scheme};package=${cfg.package};` +
    `S.browser_fallback_url=${encodeURIComponent(cfg.fallback)};end`;

  // 1. Show the intent URL clearly
  setStatus("Intent URL: " + intentUrl);

  // 2. Wait 3 seconds before starting countdown
  setTimeout(() => {
    let countdown = 3;

    setStatus(`Opening Windows App in ${countdown} seconds…`);

    const timer = setInterval(() => {
      countdown -= 1;

      if (countdown > 0) {
        setStatus(`Opening Windows App in ${countdown} second…`);
      } else {
        clearInterval(timer);
        setStatus("Launching now…");
        window.location.href = intentUrl;
      }
    }, 1000);

  }, 10000); // <-- 3 second pause before countdown
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

