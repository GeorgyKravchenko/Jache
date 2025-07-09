/**
 * SmartProfiler — smart function profiler with safe memoization and advanced analytics.
 * @class
 */
class SmartProfiler {
  /**
   * @param {Object} options
   * @param {number} [options.hotPercentile=0.95] - Percentile for "hot" function detection
   * @param {number} [options.minTimeMs=1] - Minimum time for optimization (ms)
   * @param {boolean} [options.safeOptimizations=true] - Only safe optimizations
   * @param {number} [options.historySize=1000] - Call history size for analytics
   */
  constructor({ hotPercentile = 0.95, minTimeMs = 1, safeOptimizations = true, historySize = 1000 } = {}) {
    this.stats = new Map();
    this.optimized = new Map();
    this.hotPercentile = hotPercentile;
    this.minTimeMs = minTimeMs;
    this.safeOptimizations = safeOptimizations;
    this.historySize = historySize;
    this.histories = new Map(); // name -> array of times
    this.customThresholds = new Map(); // name -> { minTimeMs, hotPercentile }
  }

  /**
   * Profiles a function and applies safe optimizations.
   * @param {Function} fn - Function to profile
   * @param {string} name - Function name
   * @param {Object} [opts]
   * @param {boolean} [opts.memoize] - Enable memoization for pure functions
   * @param {number} [opts.minTimeMs] - Custom time threshold
   * @param {number} [opts.percentile] - Custom percentile
   * @returns {Function} - Wrapped function
   */
  profile(fn, name, opts = {}) {
    const stats = this.stats;
    const optimized = this.optimized;
    let callTimes = [];
    let isOptimized = false;
    let optimizedFn = fn;
    let callCount = 0;
    const history = [];
    this.histories.set(name, history);
    if (opts.minTimeMs || opts.percentile) {
      this.customThresholds.set(name, {
        minTimeMs: opts.minTimeMs,
        hotPercentile: opts.percentile
      });
    }
    const self = this;
    function wrapper(...args) {
      const t0 = performance.now();
      const res = optimizedFn(...args);
      const t1 = performance.now();
      const dt = t1 - t0;
      callTimes.push(dt);
      callCount++;
      history.push(dt);
      if (history.length > (opts.historySize || 1000)) history.shift();

      // After 100 calls — analyze
      if (!isOptimized && callTimes.length === 100) {
        const sorted = [...callTimes].sort((a, b) => a - b);
        const p = Math.floor(sorted.length * ((opts.percentile || self.hotPercentile)));
        const hotTime = sorted[p];
        stats.set(name, {
          median: sorted[50],
          hot: hotTime,
          min: sorted[0],
          max: sorted[99],
          count: callCount,
          histogram: SmartProfiler.buildHistogram(history),
          history: [...history]
        });
        const minTime = opts.minTimeMs || self.minTimeMs;
        if (hotTime > minTime) {
          if (opts.memoize && SmartProfiler.isPure(fn)) {
            optimizedFn = SmartProfiler.memoize(fn);
            isOptimized = true;
            optimized.set(name, 'memoized');
          }
        }
      }
      return res;
    }
    wrapper.__jacheStats = () => stats.get(name) || {};
    return wrapper;
  }

  /**
   * Set custom thresholds for a function
   * @param {string} name
   * @param {Object} thresholds
   * @param {number} [thresholds.minTimeMs]
   * @param {number} [thresholds.percentile]
   */
  setThresholds(name, thresholds) {
    this.customThresholds.set(name, thresholds);
  }

  /**
   * Get statistics for all functions
   * @returns {Array}
   */
  getStats() {
    return Array.from(this.stats.entries()).map(([name, s]) => ({ name, ...s }));
  }

  /**
   * Print top slowest functions with histogram
   * @param {number} [topN=5]
   */
  printHotFunctions(topN = 5) {
    const arr = this.getStats().sort((a, b) => b.hot - a.hot);
    console.log('=== HOT FUNCTIONS ===');
    arr.slice(0, topN).forEach(s => {
      console.log(`${s.name.padEnd(25)} | hot: ${s.hot?.toFixed(2) ?? '-'}ms | median: ${s.median?.toFixed(2) ?? '-'}ms | calls: ${s.count}`);
      if (s.histogram) {
        console.log('  ' + SmartProfiler.renderHistogram(s.histogram));
      }
    });
  }

  /**
   * Build a histogram of execution times
   * @param {number[]} arr
   * @param {number} [bins=10]
   * @returns {number[]}
   */
  static buildHistogram(arr, bins = 10) {
    if (!arr.length) return Array(bins).fill(0);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    if (min === max) return [arr.length];
    const step = (max - min) / bins;
    const hist = Array(bins).fill(0);
    for (const v of arr) {
      const idx = Math.min(bins - 1, Math.floor((v - min) / step));
      hist[idx]++;
    }
    return hist;
  }

  /**
   * Render histogram as ASCII
   * @param {number[]} hist
   * @returns {string}
   */
  static renderHistogram(hist) {
    const max = Math.max(...hist);
    return hist.map(v => (v ? '█'.repeat(Math.round((v / max) * 10)) : '')).join(' ');
  }

  /**
   * Check if a function is pure (heuristic)
   * @param {Function} fn
   * @returns {boolean}
   */
  static isPure(fn) {
    const src = fn.toString();
    return !/console\.|Math\.random|Date\.now|fetch|localStorage|setTimeout|setInterval/.test(src);
  }

  /**
   * Memoize a function
   * @param {Function} fn
   * @returns {Function}
   */
  static memoize(fn) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const res = fn(...args);
      cache.set(key, res);
      return res;
    };
  }
}

module.exports = SmartProfiler; 