// Comprehensive benchmark with multiple demonstrations
const SmartProfiler = require('../src/core/smart-profiler');
const advancedTestFunctions = require('../src/test-functions/advanced');
const { performance } = require('perf_hooks');

class ComprehensiveBenchmark {
  constructor() {
    this.profiler = new SmartProfiler({ minTimeMs: 0.5 });
    this.results = {};
    this.demonstrations = [];
  }

  createProfiledFunctions() {
    const functions = {};
    for (const [name, fn] of Object.entries(advancedTestFunctions)) {
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
    this.profiler.printHotFunctions(10);
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