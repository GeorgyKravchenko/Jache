/**
 * Jache: TypeScript typings
 */

export interface SmartProfilerOptions {
  hotPercentile?: number;
  minTimeMs?: number;
  safeOptimizations?: boolean;
  historySize?: number;
  profileAfter?: number;
}

export interface ProfileOptions {
  memoize?: boolean;
  minTimeMs?: number;
  percentile?: number;
  historySize?: number;
  profileAfter?: number;
}

export interface FunctionStats {
  name: string;
  median: number;
  hot: number;
  min: number;
  max: number;
  count: number;
  history: number[];
}

export interface ProfileEvent {
  time: number;
  args: any[];
  callCount: number;
}

export class SmartProfiler {
  constructor(options?: SmartProfilerOptions);
  profile<T extends (...args: any[]) => any>(fn: T, name: string, opts?: ProfileOptions): T;
  setThresholds(name: string, thresholds: { minTimeMs?: number; percentile?: number }): void;
  getStats(): FunctionStats[];
  on(event: 'profile', listener: (fnName: string, data: ProfileEvent) => void): this;
  on(event: 'threshold', listener: (fnName: string, time: number) => void): this;
  on(event: 'optimization', listener: (fnName: string, type: string) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
}

// Legacy alias for backward compatibility
export interface JacheConfig extends SmartProfilerOptions {}

export class Jache {
  constructor(config?: JacheConfig);
  profile<T extends (...args: any[]) => any>(fn: T, fnName: string, options?: ProfileOptions): T;
  getStats(): FunctionStats[];
  reset(): void;
  on(event: 'profile', listener: (fnName: string, data: ProfileEvent) => void): this;
  on(event: 'threshold', listener: (fnName: string, time: number) => void): this;
  on(event: 'optimization', listener: (fnName: string, type: string) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): boolean;
}

// Quick start function
export function profile<T extends (...args: any[]) => any>(fn: T, fnName: string, options?: ProfileOptions): T;

// Default configuration
export const defaultConfig: JacheConfig; 