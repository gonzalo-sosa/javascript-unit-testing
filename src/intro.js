// Lesson: Writing your first tests
// export function max(a, b) {
//   if (a > b) return a;
//   else if (b > a) return b;
//   return a;
// }

export function max(a, b) {
  return a >= b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return NaN;

  const total = numbers.reduce((sum, curr) => sum + curr, 0);

  return total / numbers.length;
}

export function factorial(n) {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}
