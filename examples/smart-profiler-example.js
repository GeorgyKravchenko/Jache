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

console.log('🚀 Jache Smart Profiler Example\n');

// Create profiler with event listeners and lazy profiling
const profiler = new SmartProfiler({ 
  minTimeMs: 0.1,
  profileAfter: 100  // Start profiling after 100 calls
});

// Event-driven monitoring
profiler.on('profile', (fnName, data) => {
  if (data.time > 10) {
    console.log(`🐌 ${fnName} slow: ${data.time.toFixed(2)}ms (call #${data.callCount})`);
  }
});

profiler.on('threshold', (fnName, time) => {
  console.log(`⚠️ ${fnName} exceeded threshold: ${time.toFixed(2)}ms`);
});

profiler.on('optimization', (fnName, type) => {
  console.log(`✨ ${fnName} optimized with ${type}`);
});

// Test 1: Recursive function
console.log('=== Test 1: Recursive function (fibonacci) ===');

// Without optimization
const start1 = performance.now();
for (let i = 0; i < 1000; i++) {
  fibonacci(20);
}
const time1 = performance.now() - start1;

// With SmartProfiler (start profiling immediately for recursive functions)
const optimizedFib = profiler.profile(fibonacci, 'fibonacci', { 
  memoize: true,
  profileAfter: 10  // Profile early for recursive functions
});

const start2 = performance.now();
for (let i = 0; i < 100; i++) {
  optimizedFib(20);
}
const time2 = performance.now() - start2;

console.log(`Without optimization: ${time1.toFixed(2)}ms`);
console.log(`With Jache: ${time2.toFixed(2)}ms`);
const improvement1 = ((time1 - time2) / time1 * 100);
const speedup1 = (time1 / time2);
console.log(`Improvement: ${improvement1.toFixed(1)}%`);
console.log(`Speedup: ${speedup1.toFixed(2)}x\n`);

// Test 2: Expensive calculations
console.log('=== Test 2: Expensive calculations ===');

// Without optimization
const start3 = performance.now();
for (let i = 0; i < 1000; i++) {
  expensiveCalculation(i, i+1, i+2);
}
const time3 = performance.now() - start3;

// With SmartProfiler
const optimizedCalc = profiler.profile(expensiveCalculation, 'expensiveCalculation');

const start4 = performance.now();
for (let i = 0; i < 1000; i++) {
  optimizedCalc(i, i+1, i+2);
}
const time4 = performance.now() - start4;

console.log(`Without optimization: ${time3.toFixed(2)}ms`);
console.log(`With Jache: ${time4.toFixed(2)}ms`);
const improvement2 = ((time3 - time4) / time3 * 100);
const speedup2 = (time3 / time4);
console.log(`Improvement: ${improvement2.toFixed(1)}%`);
console.log(`Speedup: ${speedup2.toFixed(2)}x\n`);

// Test 3: Large array processing
console.log('=== Test 3: Large array processing ===');

const largeArray = Array.from({ length: 10000 }, (_, i) => i);

// Without optimization
const start5 = performance.now();
for (let i = 0; i < 100; i++) {
  processLargeArray(largeArray);
}
const time5 = performance.now() - start5;

// With SmartProfiler (lazy profiling for fast functions)
const optimizedArray = profiler.profile(processLargeArray, 'processLargeArray', {
  profileAfter: 200  // Profile later for array functions
});

const start6 = performance.now();
for (let i = 0; i < 100; i++) {
  optimizedArray(largeArray);
}
const time6 = performance.now() - start6;

console.log(`Without optimization: ${time5.toFixed(2)}ms`);
console.log(`With Jache: ${time6.toFixed(2)}ms`);
const improvement3 = ((time5 - time6) / time5 * 100);
const speedup3 = (time5 / time6);
console.log(`Improvement: ${improvement3.toFixed(1)}%`);
console.log(`Speedup: ${speedup3.toFixed(2)}x\n`);

// Show final statistics
console.log('=== Final Statistics ===');
const stats = profiler.getStats().sort((a, b) => b.hot - a.hot);
stats.forEach(s => {
  console.log(`${s.name.padEnd(20)} | hot: ${s.hot?.toFixed(2) ?? '-'}ms | median: ${s.median?.toFixed(2) ?? '-'}ms | calls: ${s.count}`);
});

console.log('\n💡 Key Features:');
console.log('- Lazy profiling: minimal overhead for fast functions');
console.log('- Event-driven monitoring for real-time insights');
console.log('- Automatic memoization for pure functions');
console.log('- Performance profiling with detailed statistics'); 