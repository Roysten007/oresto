import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

/**
 * Track a page view (Note: GA4 via Firebase often tracks this automatically)
 */
export function trackPageView(path: string, title?: string) {
  if (!analytics) return;
  logEvent(analytics, "page_view", {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track a custom event (Purchase, Add to Cart, etc.)
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}

/**
 * Identify user to link demographics and database ID to analytics
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (!analytics) return;
  setUserId(analytics, userId);
  if (properties) {
    setUserProperties(analytics, properties);
  }
}

/**
 * Example: track order completion
 */
export function trackOrder(orderId: string, total: number, shopName: string) {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: total,
    currency: "XOF",
    items: [{ item_name: shopName }]
  });
}
