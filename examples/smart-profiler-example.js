const SmartProfiler = require('../src/core/smart-profiler');
const { performance } = require('perf_hooks');

// Example 1: Recursive function (great for memoization)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example 2: Expensive calculation function
function expensiveCalculation(x, y, z) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2);
  }
  return result;
}

// Example 3: Array processing function
function processLargeArray(arr) {
  return arr.map(x => x * 2).filter(x => x > 10).reduce((sum, x) => sum + x, 0);
}

console.log('🚀 Comparison: plain code vs Jache\n');

// Test 1: Recursive function
console.log('=== Test 1: Recursive function (fibonacci) ===');

// Without optimization
const start1 = performance.now();
for (let i = 0; i < 10; i++) {
  fibonacci(20);
}
const time1 = performance.now() - start1;

// With SmartProfiler
const profiler1 = new SmartProfiler({ minTimeMs: 0.1 });
const optimizedFib = profiler1.profile(fibonacci, 'fibonacci', { memoize: true });

const start2 = performance.now();
for (let i = 0; i < 10; i++) {
  optimizedFib(20);
}
const time2 = performance.now() - start2;

console.log(`Without optimization: ${time1.toFixed(2)}ms`);
console.log(`With Jache: ${time2.toFixed(2)}ms`);
console.log(`Improvement: ${((time1 - time2) / time1 * 100).toFixed(1)}%\n`);

// Test 2: Expensive calculations
console.log('=== Test 2: Expensive calculations ===');

// Without optimization
const start3 = performance.now();
for (let i = 0; i < 100; i++) {
  expensiveCalculation(i, i+1, i+2);
}
const time3 = performance.now() - start3;

// With SmartProfiler
const profiler2 = new SmartProfiler({ minTimeMs: 0.1 });
const optimizedCalc = profiler2.profile(expensiveCalculation, 'expensiveCalculation');

const start4 = performance.now();
for (let i = 0; i < 100; i++) {
  optimizedCalc(i, i+1, i+2);
}
const time4 = performance.now() - start4;

console.log(`Without optimization: ${time3.toFixed(2)}ms`);
console.log(`With Jache: ${time4.toFixed(2)}ms`);
console.log(`Improvement: ${((time3 - time4) / time3 * 100).toFixed(1)}%\n`);

// Test 3: Large array processing
console.log('=== Test 3: Large array processing ===');

const largeArray = Array.from({ length: 10000 }, (_, i) => i);

// Without optimization
const start5 = performance.now();
for (let i = 0; i < 10; i++) {
  processLargeArray(largeArray);
}
const time5 = performance.now() - start5;

// With SmartProfiler
const profiler3 = new SmartProfiler({ minTimeMs: 0.1 });
const optimizedArray = profiler3.profile(processLargeArray, 'processLargeArray');

const start6 = performance.now();
for (let i = 0; i < 10; i++) {
  optimizedArray(largeArray);
}
const time6 = performance.now() - start6;

console.log(`Without optimization: ${time5.toFixed(2)}ms`);
console.log(`With Jache: ${time6.toFixed(2)}ms`);
console.log(`Improvement: ${((time5 - time6) / time5 * 100).toFixed(1)}%\n`);


console.log('\n💡 Takeaways:');
console.log('- SmartProfiler automatically detects slow functions');
console.log('- Memoization works only for pure functions');
console.log('- Profiling shows real execution time');
console.log('- Overhead is minimal for fast functions'); 