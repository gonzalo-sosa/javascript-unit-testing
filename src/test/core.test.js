import { describe, it, expect } from "vitest";
import { getCoupons } from "../core";

describe("getCoupons", () => {
  it("should return an array of coupons not empty", () => {
    const coupons = getCoupons();

    expect(Array.isArray(coupons)).toBeTruthy();
    expect(coupons.length).toBeGreaterThan(0);
  });

  it("should return an array of objects with valid  code", () => {
    const coupons = getCoupons();

    coupons.forEach((c) => {
      expect(c).toHaveProperty("code");
      expect(typeof c.code).toBe("string");
      expect(c.code).toBeTruthy(); // para string vacíos
    });
  });

  it("should return an array of objects with valid discount", () => {
    const coupons = getCoupons();

    coupons.forEach((c) => {
      expect(c).toHaveProperty("discount");
      expect(typeof c.discount).toBe("number");
      expect(c.discount).toBeGreaterThan(0);
      expect(c.discount).toBeLessThan(1);
    });
  });
});
