# Jache: JS/TS Smart Function Profiler & Safe JIT Compiler

## 🚀 What is it?

A smart runtime profiler for JS/TS with **safe optimizations** and **automatic memoization** that tracks function performance and applies only proven optimizations.

### 🔥 Features

- **Smart profiling**: Tracks real execution time of functions
- **Safe memoization**: Automatic memoization for pure recursive functions
- **Performance statistics**: Detailed analytics with percentiles
- **Minimal overhead**: Profiles only slow functions
- **Simple API**: Easy to integrate into any project

### 🎯 Optimizations

#### SmartProfiler
- **Automatic detection of slow functions** (by percentile)
- **Safe memoization** for pure functions only
- **Execution time profiling** with median, min/max
- **Configurable thresholds** for optimization

#### Safe optimizations
- ✅ **Memoization** - for pure recursive functions
- ✅ **Profiling** - no code changes
- ❌ **NO dangerous AST transforms**
- ❌ **NO map/filter/reduce optimizations**
- ❌ **NO strength reduction**

## 📁 Architecture

```
Jache/
├── src/
│   ├── core/
│   │   ├── smart-profiler.js    # Main profiler
│   ├── jit/
│   │   ├── advanced-jit.js      # Safe memoization
│   └── test-functions/
│       ├── basic.js             # Basic test functions
│       └── advanced.js          # Advanced test functions
├── examples/
│   ├── smart-profiler-example.js # SmartProfiler usage example
├── benchmarks/
│   └── comprehensive-benchmark.js # Comprehensive benchmark
├── index.js                     # Main API file
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
npm install jache
```

### Basic usage

```javascript
const { SmartProfiler } = require('jache');

// Create a profiler
const profiler = new SmartProfiler({
  minTimeMs: 1.0,           // Optimize functions slower than 1ms
  hotPercentile: 0.95       // 95th percentile for "hot" functions
});

// Profile a function
const optimizedFn = profiler.profile(myFunction, 'myFunction', {
  memoize: true             // Enable memoization for pure functions
});

// Use as a regular function
const result = optimizedFn(1, 2, 3);

// Show statistics
profiler.printHotFunctions(10);
```

### Handy functions

```javascript
const { profile } = require('jache');

// Quick profiling
const fastFn = profile(myFunction, 'myFunction', { memoize: true });
```

### Full example

```javascript
const { SmartProfiler } = require('jache');

// Recursive function (great for memoization)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Create a profiler
const profiler = new SmartProfiler({ minTimeMs: 0.1 });

// Profile with memoization
const optimizedFib = profiler.profile(fibonacci, 'fibonacci', { memoize: true });

// Test
console.log('Without optimization:');
const start1 = performance.now();
for (let i = 0; i < 10; i++) {
  fibonacci(20);
}
console.log(`Time: ${performance.now() - start1}ms`);

console.log('\nWith SmartProfiler:');
const start2 = performance.now();
for (let i = 0; i < 10; i++) {
  optimizedFib(20);
}
console.log(`Time: ${performance.now() - start2}ms`);

// Show stats
profiler.printHotFunctions();
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

SmartProfiler tests various types of functions:

- **Recursive functions** - automatic memoization
- **Expensive calculations** - performance profiling
- **Array processing** - compare with V8 optimizations
- **Math functions** - safe profiling

## ⚙️ Configuration

```javascript
const config = {
  minTimeMs: 1.0,              // Minimum time for optimization (ms)
  hotPercentile: 0.95,         // Percentile for "hot" functions
  safeOptimizations: true      // Only safe optimizations
};
```

## 📈 API

### SmartProfiler

```javascript
const profiler = new SmartProfiler(config);

// Profile a function
const optimizedFn = profiler.profile(fn, fnName, options);

// Get statistics
const stats = profiler.getStats();

// Show hot functions
profiler.printHotFunctions(topN = 10);
```

### Profiling options

```javascript
const options = {
  memoize: true,        // Enable memoization for pure functions
  percentile: 0.95      // Percentile for analysis (default 0.95)
};
```

### Statistics

```javascript
const stats = profiler.getStats();
// Returns an array of objects:
// {
//   name: 'functionName',
//   median: 0.5,        // Median execution time
//   hot: 1.2,           // 95th percentile
//   min: 0.1,           // Minimum time
//   max: 5.0,           // Maximum time
//   count: 100          // Call count
// }
```

## 🎯 When to use

### ✅ Great for:
- Recursive functions (fibonacci, factorial)
- Expensive calculations
- Functions called with the same parameters
- Performance profiling

### ❌ Not for:
- Functions with side effects
- Functions that must run every time
- Very fast functions (< 0.1ms)
- Functions with many unique parameters

## 🔧 Safety

SmartProfiler applies **only safe optimizations**:

- ✅ Memoization for pure functions
- ✅ Profiling without code changes
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