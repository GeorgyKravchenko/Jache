/**
 * Jache: TypeScript typings
 */

export interface SmartProfilerOptions {
  hotPercentile?: number;
  minTimeMs?: number;
  safeOptimizations?: boolean;
  historySize?: number;
}

export interface ProfileOptions {
  memoize?: boolean;
  minTimeMs?: number;
  percentile?: number;
  historySize?: number;
}

export interface FunctionStats {
  name: string;
  median: number;
  hot: number;
  min: number;
  max: number;
  count: number;
  histogram: number[];
  history: number[];
}

export class SmartProfiler {
  constructor(options?: SmartProfilerOptions);
  profile<T extends (...args: any[]) => any>(fn: T, name: string, opts?: ProfileOptions): T;
  setThresholds(name: string, thresholds: { minTimeMs?: number; percentile?: number }): void;
  getStats(): FunctionStats[];
  printHotFunctions(topN?: number): void;
}

export class AdvancedJit {
  compile<T extends (...args: any[]) => any>(fn: T, fnName: string): Promise<T>;
}

export interface JacheConfig extends SmartProfilerOptions {}

export class Jache {
  constructor(config?: JacheConfig);
  profile<T extends (...args: any[]) => any>(fn: T, fnName: string, options?: ProfileOptions): T;
  getStats(): FunctionStats[];
  printHotFunctions(topN?: number): void;
  reset(): void;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}

export function profile<T extends (...args: any[]) => any>(fn: T, fnName: string, options?: ProfileOptions): T;

export const defaultConfig: JacheConfig; 