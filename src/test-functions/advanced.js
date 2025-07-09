// Advanced test functions for demonstration of all optimization types

// 1. Function with map + filter (should be profiled)
function processArray(arr) {
  return arr.map(x => x * 2).filter(x => x > 10);
}

// 2. Function with multiple Math calls (should be profiled)
function calculateComplex(x, y, z) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += Math.abs(x) + Math.min(y, z) + Math.max(x, y) + Math.floor(z);
  }
  return result;
}

// 3. Function with type checks
function typeSafeAdd(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  return 0;
}

// 4. Inefficient string concatenation
function buildString(arr) {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    result += arr[i] + ',';
  }
  return result;
}

// 5. Expensive math operations
function expensiveMath(x) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += x * 2 + x * 4 + x * 8 + x / 2 + x / 4;
  }
  return result;
}

// 6. Short loop (for unrolling)
function shortLoop(x) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += x + i;
  }
  return sum;
}

// 7. for...in loop
function sumObject(obj) {
  let sum = 0;
  for (let key in obj) {
    sum += obj[key];
  }
  return sum;
}

// 8. Dead code
function deadCodeFunction(x) {
  if (false) {
    console.log('This will never execute');
  }
  return x * 2;
}

// 9. Multiple reduces
function complexArrayProcessing(arr) {
  const doubled = arr.reduce((acc, x) => {
    acc.push(x * 2);
    return acc;
  }, []);
  const filtered = doubled.reduce((acc, x) => {
    if (x > 10) acc.push(x);
    return acc;
  }, []);
  return filtered.reduce((sum, x) => sum + x, 0);
}

// 10. Inefficient array creation
function createLargeArray(size) {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = i * 2;
  }
  return arr;
}

// 11. Pure function for memoization
function pureCalculation(a, b, c) {
  return Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2);
}

// 12. Multiple passes over array
function multiplePasses(arr) {
  const mapped = arr.map(x => x * 2);
  const filtered = mapped.filter(x => x > 10);
  const summed = filtered.reduce((sum, x) => sum + x, 0);
  return summed;
}

// 13. Recursive function for memoization
function fibonacciWithMemo(n) {
  if (n <= 1) return n;
  return fibonacciWithMemo(n - 1) + fibonacciWithMemo(n - 2);
}

// 14. TypedArray specialization
function numericArrayProcessing(arr) {
  const result = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] * 2 + 1;
  }
  return result;
}

// 15. Multiple conditions (dead branch elimination)
function conditionalProcessing(x, y) {
  let result = 0;
  if (typeof x === 'number') {
    result += x * 2;
  }
  if (false) {
    result += 1000; // Dead code
  }
  if (y > 0) {
    result += y;
  }
  return result;
}

module.exports = {
  processArray,
  calculateComplex,
  typeSafeAdd,
  buildString,
  expensiveMath,
  shortLoop,
  sumObject,
  deadCodeFunction,
  complexArrayProcessing,
  createLargeArray,
  pureCalculation,
  multiplePasses,
  fibonacciWithMemo,
  numericArrayProcessing,
  conditionalProcessing
}; 