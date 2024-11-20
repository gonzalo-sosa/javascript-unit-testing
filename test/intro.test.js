import { describe, it, expect } from 'vitest';
import { calculateAverage, factorial, fizzBuzz, max } from '../src/intro.js';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    // AAA -> Arrange, Act, Assert
    const a = 2;
    const b = 1;

    const result = max(a, b);

    expect(result).toBe(2);
  });

  it('should return the second argument if it is greater', () => {
    const a = 0;
    const b = 1;

    const result = max(a, b);

    expect(result).toBe(1);
  });

  it('should return the first argument if arguments are equal', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return FizzBuzz if argument is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('should return Fizz if argument is divisible by 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
  });

  it('should return Buzz if argument is divisible by 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });

  it('should return a string if argument is not divisible by 3 or divisible by 5', () => {
    expect(fizzBuzz(2)).toBe(`${2}`);
  });
});

describe('calculateAverage', () => {
  it('should return NaN if given an empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it('should calculate the average of an array with a single element', () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it('should calculate the average of an array with two element', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it('should calculate the average of an array with three element', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1 if the value is 0', () => {
    expect(factorial(0)).toBe(1);
  });

  it('should return 1 if the value is 1', () => {
    expect(factorial(1)).toBe(1);
  });

  it('should return 2 if the value is 2', () => {
    expect(factorial(2)).toBe(2);
  });

  it('should return 6 if the value is 3', () => {
    expect(factorial(3)).toBe(6);
  });

  it('should return 24 if the value is 4', () => {
    expect(factorial(4)).toBe(24);
  });

  it('should return undefined if given a negative number', () => {
    expect(factorial(-1)).toBeUndefined();
  });
});
