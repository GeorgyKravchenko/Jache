// Main entry point for Jache
const Jache = require('./src/core/smart-profiler');

// Export main class and helper functions
module.exports = {
  Jache,
  // Quick start function
  profile: (fn, fnName, options = {}) => {
    const profiler = new Jache();
    return profiler.profile(fn, fnName, options);
  },
  // Default config
  defaultConfig: {
    hotPercentile: 0.95,
    minTimeMs: 1.0,
    safeOptimizations: true
  }
}; 