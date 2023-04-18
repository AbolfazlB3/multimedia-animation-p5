import { configs } from "./main.js";

export class Timer {
  constructor(duration, loop = false) {
    this.loop = loop ?? false;
    this.reset(duration ?? 0);
  }

  reset(duration) {
    this.duration = duration ?? 0;
    this.remaining = this.duration;
    this.triggered = false;
    this.dead = false;
  }

  tick() {
    if (this.dead) return;
    if (this.remaining <= 0) {
      this.trigger();
      if (this.loop) this.remaining = this.duration;
      else this.dead = true;
      return;
    }
    this.remaining -= configs.delta;
  }

  trigger() {
    this.triggered = true;
  }

  isTriggered() {
    const triggered = this.triggered;
    this.triggered = false;
    return triggered;
  };
}
