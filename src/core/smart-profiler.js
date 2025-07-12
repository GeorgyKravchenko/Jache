const { EventEmitter } = require('events');

/**
 * SmartProfiler — smart function profiler with safe memoization and advanced analytics.
 * @class
 */
class SmartProfiler extends EventEmitter {
  /**
   * @param {Object} options
   * @param {number} [options.hotPercentile=0.95] - Percentile for "hot" function detection
   * @param {number} [options.minTimeMs=1] - Minimum time for optimization (ms)
   * @param {boolean} [options.safeOptimizations=true] - Only safe optimizations
   * @param {number} [options.historySize=1000] - Call history size for analytics
   * @param {number} [options.profileAfter=50] - Start profiling after N calls
   */
  constructor({ hotPercentile = 0.95, minTimeMs = 1, safeOptimizations = true, historySize = 1000, profileAfter = 50 } = {}) {
    super();
    this.stats = new Map();
    this.optimized = new Map();
    this.hotPercentile = hotPercentile;
    this.minTimeMs = minTimeMs;
    this.safeOptimizations = safeOptimizations;
    this.historySize = historySize;
    this.profileAfter = profileAfter;
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
   * @param {number} [opts.profileAfter] - Start profiling after N calls
   * @returns {Function} - Wrapped function
   */
  profile(fn, name, opts = {}) {
    const stats = this.stats;
    const optimized = this.optimized;
    let callTimes = [];
    let isOptimized = false;
    let optimizedFn = fn;
    let callCount = 0;
    let isProfiling = false;
    const history = [];
    this.histories.set(name, history);
    if (opts.minTimeMs || opts.percentile) {
      this.customThresholds.set(name, {
        minTimeMs: opts.minTimeMs,
        hotPercentile: opts.percentile
      });
    }
    const profileAfter = opts.profileAfter || this.profileAfter;
    const self = this;
    
    function wrapper(...args) {
      callCount++;
      
      // Lazy profiling: start profiling only after profileAfter calls
      if (!isProfiling && callCount >= profileAfter) {
        isProfiling = true;
      }
      
      let dt = 0;
      if (isProfiling) {
        const t0 = performance.now();
        const res = optimizedFn(...args);
        const t1 = performance.now();
        dt = t1 - t0;
        callTimes.push(dt);
        history.push(dt);
        if (history.length > (opts.historySize || 1000)) history.shift();

        // Emit profile event
        self.emit('profile', name, { time: dt, args, callCount });

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
            history: [...history]
          });
          const minTime = opts.minTimeMs || self.minTimeMs;
          if (hotTime > minTime) {
            // Emit threshold event
            self.emit('threshold', name, hotTime);
            
            if (opts.memoize && SmartProfiler.isPure(fn)) {
              optimizedFn = SmartProfiler.memoize(fn);
              isOptimized = true;
              optimized.set(name, 'memoized');
              // Emit optimization event
              self.emit('optimization', name, 'memoization');
            }
          }
        }
        return res;
      } else {
        // Fast path: no profiling overhead
        return optimizedFn(...args);
      }
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