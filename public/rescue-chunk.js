// Emergency bridge for any outdated chunk requests
console.warn("[Oresto] Stale chunk requested: executing auto-recovery.");

try {
  if (typeof window !== "undefined") {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        for (var i = 0; i < regs.length; i++) {
          regs[i].unregister();
        }
      });
    }
    if ("caches" in window) {
      caches.keys().then(function(keys) {
        for (var i = 0; i < keys.length; i++) {
          caches.delete(keys[i]);
        }
      });
    }
    var cleanUrl = window.location.pathname + window.location.search;
    var separator = cleanUrl.indexOf("?") === -1 ? "?" : "&";
    window.location.replace(cleanUrl + separator + "_v=" + Date.now());
  }
} catch (e) {
  console.error(e);
}

export default function RescueComponent() {
  return null;
}
