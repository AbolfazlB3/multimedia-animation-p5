import { Entity } from "../Entity.js";
import { configs, pf } from "../main.js";
import { Sounds } from "../Sounds.js";
import { randInt, randRange } from "../utils.js";
import { ExplosionEntity } from "./Explosion.js";
import { FireTail } from "./FireTrail.js";

export class RocketEntity extends Entity {
  S = [0.3, 1];
  O = [0.15, 0.5];
  SPRITE_NAME;
  physics = true;
  burning = true;
  burnTime = 4; // seconds
  exhaust = 40; // acceleration due to rocket exhaust
  explosionDelay = 1;

  constructor(x, y, power) {
    super(x, y);
    power = power ?? 1;
    this.SPRITE_NAME = `rocket_${randInt(1, 5)}`;
    this.V = [0, 0]; // [randRange(-3, 3), randRange(10, 16)];
    this.scale = randRange(1, 3);
    this.R = randRange(-Math.PI / 15, +Math.PI / 15);
    this.burnTime = randRange(1, 3) * power;
    this.explosionDelay = randRange(0.2, 1.5) * Math.max(power, 1);
  }

  init() {
    super.init();
    const fire = new FireTail(0, -0.55);
    fire.name = "fire";
    this.registerChildren(fire);
    this._exhaust = this.exhaust;
    this._burnTime = this.burnTime;
    this._explosionDelay = this.explosionDelay;
  }

  update() {
    if (this.X[1] < -20) return this.kill();
    super.update();
    if (this.physics) {
      if (this.burning) {
        const R = -this.R + pf.PI / 2;
        const { _exhaust, V } = this;
        this.V = [V[0] + Math.cos(R) * _exhaust * configs.delta, V[1] + Math.sin(R) * _exhaust * configs.delta];
        if (this._burnTime < this.burnTime / 3) this._exhaust = this.exhaust / 4;
        this._burnTime -= configs.delta;
        if (this._burnTime <= 0) this.extinguish();
      } else if (this._explosionDelay > 0) {
        this._explosionDelay -= configs.delta;
        if (this._explosionDelay <= 0) this.explode();
      }
      const v = this.getSpeed();
      let r = this.getHeadingRotation();
      while (r - this.R > pf.PI) r -= pf.TWO_PI;
      while (this.R - r > pf.PI) r += pf.TWO_PI;
      const ratio = 0.1 * Math.min(1, v / 50);
      this.R = this.R * (1 - ratio) + r * ratio;
    }
  }

  extinguish() {
    this.children.find(c => c.name === "fire")?.kill();
    this.burning = false;
    this._exhaust = 0;
    this._burnTime = -1;
  }

  explode() {
    const explosion = new ExplosionEntity(...this.X);
    explosion.setPower(this.scale);
    configs.world.registerChildren(explosion);
    this._explosionDelay = -1;
    const soundIndex = randInt(1, 4);
    Sounds[`rocket_explosion_${soundIndex}`].sound.play();
    this.kill();
  }

  /**
   * @param {number} t rocket preparation time in seconds
   */
  static timeToPower(t) {
    const result = pf.map(t, 0.2, 8, 0.5, 4, true);
    return result;
  }
}
