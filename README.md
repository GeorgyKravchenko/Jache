# Jache: JS/TS Smart Function Profiler & Safe JIT Compiler

## 🚀 What is it?

A smart runtime profiler for JS/TS with **safe optimizations**, **automatic memoization**, and **event-driven monitoring** that tracks function performance and applies only proven optimizations.

### 🔥 Features

- **Smart profiling**: Tracks real execution time of functions
- **Safe memoization**: Automatic memoization for pure recursive functions
- **Event-driven monitoring**: Real-time insights with event listeners
- **Performance statistics**: Detailed analytics with percentiles
- **Minimal overhead**: Profiles only slow functions
- **Simple API**: Easy to integrate into any project

### 🎯 Optimizations

#### Jache
- **Automatic detection of slow functions** (by percentile)
- **Safe memoization** for pure functions only
- **Execution time profiling** with median, min/max
- **Configurable thresholds** for optimization
- **Event-driven insights** for monitoring

#### Safe optimizations
- ✅ **Memoization** - for pure recursive functions
- ✅ **Profiling** - no code changes
- ✅ **Event monitoring** - real-time insights
- ❌ **NO dangerous AST transforms**
- ❌ **NO map/filter/reduce optimizations**
- ❌ **NO strength reduction**

## 📁 Architecture

```
Jache/
├── src/
│   └── core/
│       └── smart-profiler.js    # Jache main class (core logic)
├── examples/
│   └── smart-profiler-example.js # Usage example with events
├── benchmarks/
│   └── comprehensive-benchmark.js # Comprehensive benchmark
├── index.js                     # Main API entry point
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
npm install jache
```

### Basic usage

```javascript
const { Jache } = require('jache');

// Create a Jache instance
const jacheInstance = new Jache({
  minTimeMs: 1.0,           // Optimize functions slower than 1ms
  hotPercentile: 0.95       // 95th percentile for "hot" functions
});

// Event-driven monitoring
jacheInstance.on('profile', (fnName, data) => {
  if (data.time > 10) {
    console.log(`🐌 ${fnName} slow: ${data.time}ms`);
  }
});

jacheInstance.on('threshold', (fnName, time) => {
  console.log(`⚠️ ${fnName} exceeded threshold: ${time}ms`);
});

jacheInstance.on('optimization', (fnName, type) => {
  console.log(`✨ ${fnName} optimized with ${type}`);
});

// Profile a function
const optimizedFn = jacheInstance.profile(myFunction, 'myFunction', {
  memoize: true             // Enable memoization for pure functions
});

// Use as a regular function
const result = optimizedFn(1, 2, 3);

// Get statistics
const stats = jacheInstance.getStats();
console.log(stats);
```

### Handy functions

```javascript
const { profile } = require('jache');

// Quick profiling
const fastFn = profile(myFunction, 'myFunction', { memoize: true });
```

### Full example with events

```javascript
const { Jache } = require('jache');

// Recursive function (great for memoization)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Create a Jache instance with event monitoring
const jacheInstance = new Jache({ minTimeMs: 0.1 });

// Set up event listeners
jacheInstance.on('profile', (fnName, data) => {
  if (data.time > 5) {
    console.log(`🐌 ${fnName}: ${data.time.toFixed(2)}ms (call #${data.callCount})`);
  }
});

jacheInstance.on('threshold', (fnName, time) => {
  console.log(`⚠️ ${fnName} exceeded threshold: ${time.toFixed(2)}ms`);
});

jacheInstance.on('optimization', (fnName, type) => {
  console.log(`✨ ${fnName} optimized with ${type}`);
});

// Profile with memoization
const optimizedFib = jacheInstance.profile(fibonacci, 'fibonacci', { memoize: true });

// Test
console.log('Without optimization:');
const start1 = performance.now();
for (let i = 0; i < 10; i++) {
  fibonacci(20);
}
console.log(`Time: ${performance.now() - start1}ms`);

console.log('\nWith Jache:');
const start2 = performance.now();
for (let i = 0; i < 10; i++) {
  optimizedFib(20);
}
console.log(`Time: ${performance.now() - start2}ms`);

// Show stats
const stats = jacheInstance.getStats();
console.log('\nFunction Statistics:');
stats.forEach(s => {
  console.log(`${s.name.padEnd(15)} | hot: ${s.hot?.toFixed(2) ?? '-'}ms | median: ${s.median?.toFixed(2) ?? '-'}ms | calls: ${s.count}`);
});
```

## 📊 Benchmarks

### Run benchmarks

```bash
# Comprehensive benchmark
npm run benchmark

# Usage example
npm run example

# Tests
npm test
```

### What is tested

Jache tests various types of functions:

- **Recursive functions** - automatic memoization
- **Expensive calculations** - performance profiling
- **Array processing** - compare with V8 optimizations
- **Math functions** - safe profiling

## ⚙️ Configuration

```javascript
const config = {
  minTimeMs: 1.0,              // Minimum time for optimization (ms)
  hotPercentile: 0.95,         // Percentile for "hot" functions
  safeOptimizations: true,     // Only safe optimizations
  historySize: 1000            // Call history size for analytics
};
```

## 📈 API

### Jache

```javascript
const jacheInstance = new Jache(config);

// Profile a function
const optimizedFn = jacheInstance.profile(fn, fnName, options);

// Get statistics
const stats = jacheInstance.getStats();

// Event listeners
jacheInstance.on('profile', (fnName, data) => {});
jacheInstance.on('threshold', (fnName, time) => {});
jacheInstance.on('optimization', (fnName, type) => {});
```

### Profiling options

```javascript
const options = {
  memoize: true,        // Enable memoization for pure functions
  percentile: 0.95      // Percentile for analysis (default 0.95)
};
```

### Event Types

```javascript
// 'profile' - every function call
jacheInstance.on('profile', (fnName, data) => {
  // data: { time: number, args: any[], callCount: number }
});

// 'threshold' - function exceeded time threshold
jacheInstance.on('threshold', (fnName, time) => {
  // time: execution time in milliseconds
});

// 'optimization' - optimization applied
jacheInstance.on('optimization', (fnName, type) => {
  // type: 'memoization' or other optimization types
});
```

### Statistics

```javascript
const stats = jacheInstance.getStats();
// Returns an array of objects:
// {
//   name: 'functionName',
//   median: 0.5,        // Median execution time
//   hot: 1.2,           // 95th percentile
//   min: 0.1,           // Minimum time
//   max: 5.0,           // Maximum time
//   count: 100,         // Call count
//   history: [...]      // Execution time history
// }
```

## 🎯 When to use

### ✅ Great for:
- Recursive functions (fibonacci, factorial)
- Expensive calculations
- Functions called with the same parameters
- Performance profiling
- Real-time monitoring

### ❌ Not for:
- Functions with side effects
- Functions that must run every time
- Very fast functions (< 0.1ms)
- Functions with many unique parameters

## 🔧 Safety

Jache applies **only safe optimizations**:

- ✅ Memoization for pure functions
- ✅ Profiling without code changes
- ✅ Event monitoring
- ❌ No AST transforms
- ❌ No automatic refactoring
- ❌ No logic changes

## 📄 License

MIT License - see LICENSE for details.

## 🤝 Contributing

Pull requests and issues are welcome! Please make sure that:

1. Code follows the existing style
2. Tests are added for new features
3. Documentation is updated
4. Optimizations are safe and do not break code 