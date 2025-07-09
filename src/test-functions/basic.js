// Basic test functions for demonstration

// 1. Simple recursive function (for memoization)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 2. Math operation function
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 3. Find max in array
function findMax(arr) {
  let max = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// 4. Clamp value
function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

// 5. Sum object values
function sumObjectValues(obj) {
  let sum = 0;
  for (const key in obj) {
    sum += obj[key];
  }
  return sum;
}

// 6. Simple add
function add(a, b) {
  return a + b;
}

// 7. Sum three numbers (short loop)
function sumThree(a, b, c) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += [a, b, c][i];
  }
  return sum;
}

module.exports = {
  fibonacci,
  calculateDistance,
  findMax,
  clamp,
  sumObjectValues,
  add,
  sumThree
}; 