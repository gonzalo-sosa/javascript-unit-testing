import { describe, it, expect } from 'vitest';
import {
  calculateDiscount,
  canDrive,
  createProduct,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core.js';
import { beforeEach } from 'vitest';

describe('getCoupons', () => {
  it('should return an array of coupons not empty', () => {
    const coupons = getCoupons();

    expect(Array.isArray(coupons)).toBeTruthy();
    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should return an array of objects with valid  code', () => {
    const coupons = getCoupons();

    coupons.forEach((c) => {
      expect(c).toHaveProperty('code');
      expect(typeof c.code).toBe('string');
      expect(c.code).toBeTruthy(); // para string vacíos
    });
  });

  it('should return an array of objects with valid discount', () => {
    const coupons = getCoupons();

    coupons.forEach((c) => {
      expect(c).toHaveProperty('discount');
      expect(typeof c.discount).toBe('number');
      expect(c.discount).toBeGreaterThan(0);
      expect(c.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price when if given a valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-1, 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it('it should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});

describe('validateUserInput', () => {
  // Positive test
  it('should return success if given a valid input', () => {
    expect(validateUserInput('gonzalo', 23)).toMatch(/success/i);
  });

  // Negative test
  it('should return an error if username is a not a string', () => {
    expect(validateUserInput(1, 18)).toMatch(/invalid/i);
  });

  it('should return an error if username is less than 3 characters', () => {
    expect(validateUserInput('mo', 18)).toMatch(/invalid/i);
  });

  it('should return an error if username is longer than 255 characters', () => {
    expect(validateUserInput('A'.repeat(256), 28)).toMatch(/invalid/i);
  });

  it('should return an error if age is a not a number', () => {
    expect(validateUserInput('gonzalo', '23')).toMatch(/invalid/i);
  });

  it('should return an error if age is less than 18', () => {
    expect(validateUserInput('gonzalo', 17)).toMatch(/invalid/i);
  });

  it('should return an error if age is greater than 100', () => {
    expect(validateUserInput('gonzalo', 101)).toMatch(/invalid/i);
  });

  it('should return an error if username and age are both invalid', () => {
    expect(validateUserInput('', 0)).toMatch(/invalid username/i);
    expect(validateUserInput('', 0)).toMatch(/invalid age/i);
  });
});

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price < min', price: 10, result: false },
    { scenario: 'price == min', price: 11, result: true },
    {
      scenario: 'price between min and max',
      price: 11.5,
      result: true,
    },
    { scenario: 'price == max', price: 12, result: true },
    { scenario: 'price > max', price: 13, result: false },
  ])('should return $result when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 11, 12)).toBe(result);
  });

  /*
  it("should return false when price is outside the range", () => {
    expect(isPriceInRange(10, 11, 12)).toBe(false);
    expect(isPriceInRange(13, 11, 12)).toBe(false);
  });

  it("should return true when price is equal to min or equal to max", () => {
    expect(isPriceInRange(11, 11, 12)).toBe(true);
    expect(isPriceInRange(12, 11, 12)).toBe(true);
  });

  it("should return true when price is within the range", () => {
    expect(isPriceInRange(11.5, 11, 12)).toBe(true);
  });
  */
});

describe('isValidUsername', () => {
  const minLength = 5;
  const maxLength = 15;

  it('should return false when username is outside the range', () => {
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false);
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false);
  });

  it('should return true when username is equal to min length or equal to max length', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true);
  });

  it('should return true when username is within the range', () => {
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true);
  });

  it('should return false when username is not a string', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(5)).toBe(false);
  });
});

describe('canDrive', () => {
  const legalDrivingAge = {
    US: 16,
    UK: 17,
  };

  const countryCodes = {
    US: 'US',
    UK: 'UK',
  };

  const commonKeys = Object.keys(legalDrivingAge);

  const valid = commonKeys
    .map((key) => ({
      age: legalDrivingAge[key],
      country: countryCodes[key],
      result: true,
    }))
    .concat(
      commonKeys.map((key) => ({
        age: legalDrivingAge[key] + 1,
        country: countryCodes[key],
        result: true,
      })),
    );

  const invalid = commonKeys.map((key) => ({
    age: legalDrivingAge[key] - 1,
    country: countryCodes[key],
    result: false,
  }));

  it.each(invalid.concat(valid))(
    'should return $result for age: $age, countryCode: $country',
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    },
  );

  it('should return invalid when given an invalid country code', () => {
    expect(canDrive(18, 'AA')).toMatch(/invalid/i);
    expect(canDrive(18, 18)).toMatch(/invalid/i);
    expect(canDrive(18, null)).toMatch(/invalid/i);
    expect(canDrive(18, undefined)).toMatch(/invalid/i);
  });

  /*
  it("should return true when age is equal to legal driving age", () => {
    commonKeys.forEach((key) => {
      expect(canDrive(legalDrivingAge[key], countryCodes[key]));
    });
  });

  it("should return true when age is greater than legal driving age", () => {
    commonKeys.forEach((key) => {
      expect(canDrive(legalDrivingAge[key] + 1, countryCodes[key]));
    });
  });

  it("should return false when age is less than legal driving age", () => {
    commonKeys.forEach((key) => {
      expect(canDrive(legalDrivingAge[key] - 1, countryCodes[key]));
    });
  });
  */
});

describe('fetchData', () => {
  it('should return a promise with an array when resolved', async () => {
    const result = await fetchData();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should be an instance of Stack', () => {
    expect(stack).toBeInstanceOf(Stack);
  });

  it('should have a valid property items', () => {
    expect(stack).toHaveProperty('items');
    expect(Array.isArray(stack.items)).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('push should add an item to the stack', () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it('pop should remove and return the top item from the stack', () => {
    stack.push(1);
    stack.push(2);

    const value = stack.pop();

    expect(value).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it('pop should throw an error when is empty', () => {
    expect(() => {
      stack.pop();
    }).toThrowError(/empty/i);
  });

  it('peek should return the top item', () => {
    stack.push(1);
    stack.push(2);

    const value = stack.peek();

    expect(value).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('peek should throw an error if stack is empty', () => {
    expect(() => {
      stack.peek();
    }).toThrowError(/empty/i);
  });

  it('isEmpty should return true is stack is empty', () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it('isEmpty should return false if stack is not empty', () => {
    stack.push(1);

    expect(stack.isEmpty()).toBe(false);
  });

  it('size should the number of items in the stack', () => {
    expect(stack.size()).toBe(0);

    stack.push(1);
    stack.push(2);

    expect(stack.size()).toBe(2);
  });

  it('clear should remove all the items in the stack', () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});

describe('createProduct', () => {
  it('should return error if given product not have name', () => {
    const productWithoutName = { price: 10 };

    const {
      success,
      error: { code, message },
    } = createProduct(productWithoutName);

    expect(success).toBe(false);
    expect(code).toMatch(/invalid/i);
    expect(message).toMatch(/missing/i);
  });

  it('should return error if given product not', () => {
    const productWithoutName = { price: 10 };

    const {
      success,
      error: { code, message },
    } = createProduct(productWithoutName);

    expect(success).toBe(false);
    expect(code).toMatch(/invalid/i);
    expect(message).toMatch(/missing/i);
  });

  it('should return success if given product is valid', () => {
    const product = { name: 'p1', price: 10 };

    const { success, message } = createProduct(product);

    expect(success).toBe(true);
    expect(message).toMatch(/success/i);
  });
});
