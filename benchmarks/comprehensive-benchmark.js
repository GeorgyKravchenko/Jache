// Comprehensive benchmark with multiple demonstrations
const SmartProfiler = require('../src/core/smart-profiler');
const { performance } = require('perf_hooks');

// Test functions for benchmark
function processArray(arr) {
  return arr.map(x => x * 2).filter(x => x > 10);
}

function calculateComplex(x, y, z) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += Math.abs(x) + Math.min(y, z) + Math.max(x, y) + Math.floor(z);
  }
  return result;
}

function typeSafeAdd(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  return 0;
}

function buildString(arr) {
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    result += arr[i] + ',';
  }
  return result;
}

function expensiveMath(x) {
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += x * 2 + x * 4 + x * 8 + x / 2 + x / 4;
  }
  return result;
}

function shortLoop(x) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += x + i;
  }
  return sum;
}

function deadCodeFunction(x) {
  if (false) {
    console.log('This will never execute');
  }
  return x * 2;
}

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

function createLargeArray(size) {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = i * 2;
  }
  return arr;
}

function pureCalculation(a, b, c) {
  return Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2);
}

function multiplePasses(arr) {
  const mapped = arr.map(x => x * 2);
  const filtered = mapped.filter(x => x > 10);
  const summed = filtered.reduce((sum, x) => sum + x, 0);
  return summed;
}

function fibonacciWithMemo(n) {
  if (n <= 1) return n;
  return fibonacciWithMemo(n - 1) + fibonacciWithMemo(n - 2);
}

function numericArrayProcessing(arr) {
  const result = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] * 2 + 1;
  }
  return result;
}

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

const testFunctions = {
  processArray,
  calculateComplex,
  typeSafeAdd,
  buildString,
  expensiveMath,
  shortLoop,
  deadCodeFunction,
  complexArrayProcessing,
  createLargeArray,
  pureCalculation,
  multiplePasses,
  fibonacciWithMemo,
  numericArrayProcessing,
  conditionalProcessing
};

class ComprehensiveBenchmark {
  constructor() {
    this.profiler = new SmartProfiler({ minTimeMs: 0.5 });
    this.results = {};
    this.demonstrations = [];
  }

  createProfiledFunctions() {
    const functions = {};
    for (const [name, fn] of Object.entries(testFunctions)) {
      // Memoization only for pure functions
      const isPure = SmartProfiler.isPure(fn);
      functions[name] = this.profiler.profile(fn, name, { memoize: isPure });
    }
    return functions;
  }

  getFunctionArgs(fnName, index) {
    const argsMap = {
      // Array functions
      processArray: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      multiplePasses: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      complexArrayProcessing: [[1, 2, 3, 4, 5]],
      createLargeArray: [100],
      numericArrayProcessing: [[1, 2, 3, 4, 5]],
      buildString: [['a', 'b', 'c', 'd', 'e']],
      // Number functions
      calculateComplex: [index, index+1, index+2],
      typeSafeAdd: [index, index+1],
      expensiveMath: [index],
      shortLoop: [index],
      deadCodeFunction: [index],
      pureCalculation: [index, index+1, index+2],
      conditionalProcessing: [index, index+1],
      // Recursive
      fibonacciWithMemo: [Math.min(index % 10, 5)]
    };
    return argsMap[fnName] || [index];
  }

  async runAllFunctions(functions) {
    for (const [name, fn] of Object.entries(functions)) {
      for (let i = 0; i < 100; i++) {
        const args = this.getFunctionArgs(name, i);
        fn(...args);
      }
    }
  }

  async runAllBenchmarks() {
    console.log('🚀 Running comprehensive Jache benchmark (SmartProfiler)');
    const functions = this.createProfiledFunctions();
    const start = performance.now();
    await this.runAllFunctions(functions);
    const time = performance.now() - start;
    this.results.total = time;
    console.log(`Execution time: ${time.toFixed(2)}ms`);
    
    // Show top 10 slowest functions
    const stats = this.profiler.getStats().sort((a, b) => b.hot - a.hot);
    console.log('\n=== TOP 10 SLOWEST FUNCTIONS ===');
    stats.slice(0, 10).forEach(s => {
      console.log(`${s.name.padEnd(25)} | hot: ${s.hot?.toFixed(2) ?? '-'}ms | median: ${s.median?.toFixed(2) ?? '-'}ms | calls: ${s.count}`);
    });
    
    await this.runSpecialDemonstrations(functions);
  }

  async runSpecialDemonstrations(functions) {
    // Examples: large arrays, recursion, math, strings, multiple passes
    const demos = [
      {
        name: 'Large Array Optimization',
        fn: functions.processArray,
        args: [Array.from({ length: 10000 }, (_, i) => i)]
      },
      {
        name: 'Recursive Optimization',
        fn: functions.fibonacciWithMemo,
        args: [20]
      },
      {
        name: 'Math Optimization',
        fn: functions.calculateComplex,
        args: [100, 200, 300]
      },
      {
        name: 'String Optimization',
        fn: functions.buildString,
        args: [Array.from({ length: 1000 }, (_, i) => 'x'+i)]
      },
      {
        name: 'Array Pass Optimization',
        fn: functions.multiplePasses,
        args: [Array.from({ length: 10000 }, (_, i) => i)]
      }
    ];
    console.log('\n=== Special demonstrations ===');
    for (const demo of demos) {
      const t0 = performance.now();
      demo.fn(...demo.args);
      const t1 = performance.now() - t0;
      console.log(`${demo.name.padEnd(25)}: ${t1.toFixed(2)}ms`);
    }
  }
}

if (require.main === module) {
  (async () => {
    const bench = new ComprehensiveBenchmark();
    await bench.runAllBenchmarks();
  })();
}

module.exports = { ComprehensiveBenchmark }; 