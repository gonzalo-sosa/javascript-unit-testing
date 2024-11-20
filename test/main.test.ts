import { calculateDiscount } from '../src/main.js';
import { describe, it, expect } from 'vitest';

describe('calculateDiscount', () => {
  it('should return discounted price when if given a valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-1, 'SAVE10')).toMatch(/invalid/i);
  });

  it('it should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});
