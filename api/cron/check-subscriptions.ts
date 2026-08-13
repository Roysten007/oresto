import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Initialize Firebase Admin if not already done
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || "https://oresto-connect-default-rtdb.firebaseio.com",
  });
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = getDatabase();
    const snap = await db.ref("vendors").once("value");
    if (!snap.exists()) return res.status(200).json({ message: "No vendors found", processed: 0 });

    const vendorsData = snap.val();
    const now = Date.now();
    let processed = 0;
    const results: string[] = [];

    for (const vendorId of Object.keys(vendorsData)) {
      const v = vendorsData[vendorId];
      const status = v.subscriptionStatus || "trial";
      const dueDate = v.nextBillingDate || v.trialEndsAt;

      if (!dueDate) continue;

      // J-3: Warning notification
      if (now >= dueDate - THREE_DAYS_MS && now < dueDate && status !== "pending_payment" && status !== "restricted") {
        // Don't change status yet, just log (notification handled client-side)
        results.push(`${vendorId}: J-3 warning`);
      }

      // Day 0: Set to pending_payment
      if (now >= dueDate && now < dueDate + THREE_DAYS_MS && status !== "pending_payment" && status !== "restricted" && status !== "active") {
        await db.ref(`vendors/${vendorId}`).update({
          subscriptionStatus: "pending_payment",
        });
        results.push(`${vendorId}: → pending_payment`);
        processed++;
      }

      // J+3: Restrict
      if (now >= dueDate + THREE_DAYS_MS && status !== "restricted") {
        await db.ref(`vendors/${vendorId}`).update({
          subscriptionStatus: "restricted",
        });
        results.push(`${vendorId}: → restricted`);
        processed++;
      }
    }

    return res.status(200).json({
      message: "Subscription check complete",
      processed,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Subscription check error:", error);
    return res.status(500).json({ error: error.message });
  }
}
