import { describe, it, expect } from "vitest";
import {
  calculateTrialDates,
  generateMaketouInvoice,
  STANDARD_PLAN_PRICE,
  TRIAL_DURATION_DAYS,
  TRIAL_DURATION_MS,
  PLANS
} from "../services/subscriptionService";

describe("Subscription Service & Pricing Rules", () => {
  it("should define Oresto Pro plan at 5 000 FCFA standard price", () => {
    expect(STANDARD_PLAN_PRICE).toBe(5000);
    expect(PLANS.pro.price).toBe(5000);
  });

  it("should calculate exact 14-day trial period", () => {
    const fixedNow = 1700000000000;
    const { trialStartedAt, trialEndsAt } = calculateTrialDates(fixedNow);

    expect(trialStartedAt).toBe(fixedNow);
    expect(trialEndsAt).toBe(fixedNow + 14 * 24 * 60 * 60 * 1000);
    expect(trialEndsAt - trialStartedAt).toBe(TRIAL_DURATION_MS);
    expect(TRIAL_DURATION_DAYS).toBe(14);
  });

  it("should generate invoice for subscription with standard price", () => {
    const vendorId = "v_test_123";
    const invoice = generateMaketouInvoice(vendorId, true);

    expect(invoice.isFirstPayment).toBe(true);
    expect(invoice.amount).toBe(STANDARD_PLAN_PRICE);
    expect(invoice.plan).toBe("pro");
    expect(invoice.paymentUrl).toContain(`amt=${STANDARD_PLAN_PRICE}`);
    expect(invoice.paymentUrl).toContain(vendorId);
    expect(invoice.expiresAt).toBeGreaterThan(invoice.createdAt);
  });

  it("should generate standard invoice for recurring months", () => {
    const vendorId = "v_test_456";
    const invoice = generateMaketouInvoice(vendorId, false);

    expect(invoice.isFirstPayment).toBe(false);
    expect(invoice.amount).toBe(STANDARD_PLAN_PRICE);
    expect(invoice.plan).toBe("pro");
    expect(invoice.paymentUrl).toContain(`amt=${STANDARD_PLAN_PRICE}`);
  });
});
