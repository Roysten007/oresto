// Emergency bridge for legacy client sessions that attempt to dynamically import RestaurantPublic
console.warn("[Oresto] Legacy chunk RestaurantPublic requested: executing auto-recovery.");

try {
  if (typeof window !== "undefined") {
    // Unregister any active or legacy service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        for (var i = 0; i < regs.length; i++) {
          regs[i].unregister();
        }
      });
    }
    // Delete all legacy cache storage
    if ("caches" in window) {
      caches.keys().then(function(keys) {
        for (var i = 0; i < keys.length; i++) {
          caches.delete(keys[i]);
        }
      });
    }
    // Force immediate reload to the fresh build
    var cleanUrl = window.location.pathname + window.location.search;
    var separator = cleanUrl.indexOf("?") === -1 ? "?" : "&";
    window.location.replace(cleanUrl + separator + "_v=" + Date.now());
  }
} catch (e) {
  console.error(e);
}

// Minimal functional component to satisfy React.lazy without dependencies
export default function LegacyChunkRescue() {
  return null;
}
