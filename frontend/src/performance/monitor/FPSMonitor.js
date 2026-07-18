import { FPS_POLICY } from "../config/quality.config";

/**
 * Rolling FPS average with hysteresis-friendly window reports.
 */
export class FPSMonitor {
  constructor(options = {}) {
    this.sampleWindowMs = options.sampleWindowMs ?? FPS_POLICY.sampleWindowMs;
    this.rollingSamples = options.rollingSamples ?? FPS_POLICY.rollingSamples;
    this.downgradeBelow = options.downgradeBelow ?? FPS_POLICY.downgradeBelow;
    this.upgradeAbove = options.upgradeAbove ?? FPS_POLICY.upgradeAbove;
    this.confirmWindows = options.confirmWindows ?? FPS_POLICY.confirmWindows;

    this._frames = [];
    this._windowStart = performance.now();
    this._windowFrames = 0;
    this._lowStreak = 0;
    this._highStreak = 0;
    this._lastAverage = 60;
    this._listeners = new Set();
  }

  onRecommendation(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  /**
   * Call once per animation frame with rAF timestamp.
   */
  tick(now = performance.now()) {
    this._windowFrames += 1;
    this._frames.push(now);
    if (this._frames.length > this.rollingSamples) {
      this._frames.shift();
    }

    const elapsed = now - this._windowStart;
    if (elapsed < this.sampleWindowMs) return null;

    const fps = (this._windowFrames * 1000) / elapsed;
    this._lastAverage = fps;
    this._windowStart = now;
    this._windowFrames = 0;

    let recommendation = "hold";

    if (fps < this.downgradeBelow) {
      this._lowStreak += 1;
      this._highStreak = 0;
      if (this._lowStreak >= this.confirmWindows) {
        recommendation = "downgrade";
        this._lowStreak = 0;
      }
    } else if (fps > this.upgradeAbove) {
      this._highStreak += 1;
      this._lowStreak = 0;
      if (this._highStreak >= this.confirmWindows) {
        recommendation = "upgrade";
        this._highStreak = 0;
      }
    } else {
      this._lowStreak = 0;
      this._highStreak = 0;
    }

    const report = {
      fps,
      rollingFps: this.getRollingFps(),
      recommendation,
    };

    this._listeners.forEach((fn) => fn(report));
    return report;
  }

  getRollingFps() {
    if (this._frames.length < 2) return this._lastAverage;
    const first = this._frames[0];
    const last = this._frames[this._frames.length - 1];
    const dt = last - first;
    if (dt <= 0) return this._lastAverage;
    return ((this._frames.length - 1) * 1000) / dt;
  }

  getLastAverage() {
    return this._lastAverage;
  }

  reset() {
    this._frames = [];
    this._windowStart = performance.now();
    this._windowFrames = 0;
    this._lowStreak = 0;
    this._highStreak = 0;
  }
}
