import { Entity } from "../Entity.js";
import { configs } from "../main.js";
import { Timer } from "../Timer.js";
import { randInt, randRange } from "../utils.js";
import { RocketEntity } from "./Rocket.js";

export class TimedRocketLauncherEntity extends Entity {
  index = 0;

  constructor(x, y, num = 1, interval = null, positions = null, delay = 0) {
    super(x, y);
    this.num = num;
    this.interval = interval;
    const { S } = configs.world;
    this.positions = positions ?? new Array(num).fill(null).map(() => [randRange(S[0]), -3]);
    this.delay = delay ?? 0;
  }

  init() {
    this.index = 0;
    this.timer = new Timer(this.delay);
  }

  update() {
    super.update();
    if (this.index >= this.positions.length) {
      if (this.children.length === 0) this.kill();
      return;
    }
    this.timer.tick();
    if (this.timer.isTriggered()) {
      this.spawnAt(this.positions[this.index]);
      this.index++;
      this.timer.reset(
        this.interval == null
          ? randRange(0.5)
          : typeof this.interval === "number"
          ? this.interval
          : randRange(this.interval[0], this.interval[1])
      );
    }
  }

  spawnAt(X) {
    this.registerChildren(new RocketEntity(X[0], X[1]));
  }
}

export class RocketLauncherEntity extends Entity {
  constructor(x, y, interval) {
    super(x, y);
    this.interval = interval ?? null;
    this.cachedActions = [];
  }

  init() {
    super.init();
    this.timer = new Timer();
  }

  update() {
    super.update();
    this.timer.tick();
    if (this.timer.isTriggered()) {
      this.resetTimer();
      this.registerChildren(new TimedRocketLauncherEntity(0, 0, randInt(1, 6), [0.05, 0.5]));
    }
    if (this.cachedActions.length > 0) {
      const actions = this.cachedActions;
      this.cachedActions = [];
      actions.forEach(action => action?.(this));
    }
  }

  spawn() {
    const { S } = configs.world;
    this.spawnAt([randRange(S[0]), -3]);
  }

  spawnAt(X, power = null) {
    this.registerChildren(new RocketEntity(X[0], X[1], power));
  }

  resetTimer() {
    this.timer.reset(this.interval ?? randRange(2, 4));
  }

  spawnMultiple() {
    new Array(randInt(10, 21)).fill(null).forEach(() => this.spawn());
  }

  spawnInDirection(dir = "LTR") {
    const n = randInt(10, 21);
    const len = configs.world.S[0] / n;
    const diversion = len / 2.5;
    const positions = new Array(n).fill(null).map((_, i) => {
      const mid = len * (dir === "LTR" ? i + 0.5 : n - i - 0.5);
      return [randRange(mid - diversion, mid + diversion), -3];
    });
    this.registerChildren(new TimedRocketLauncherEntity(0, 0, n, [0.1, 0.3], positions));
  }

  cacheAction(action) {
    this.cachedActions.push(action);
  }
}
