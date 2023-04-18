import { Entity } from "../Entity.js";
import { configs, pf } from "../main.js";
import { randRange } from "../utils.js";

export class Particle extends Entity {
  physics = true;
  S = [0.1, 0.1];
  O = [0.05, 0.05];
  scale = 5;
  burnTime = 2;
  burning = true;
  colorOffset;

  constructor(...args) {
    super(...args);
    this.burnTime = randRange(1, 2);
    this.colorOffset = randRange(360);
  }

  init() {
    this._burnTime = this.burnTime;
    this.color = pf.color(`hsl(${this.colorOffset},90%,${50}%)`);
  }

  setColorOffset(offset) {
    this.colorOffset = offset;
  }

  update() {
    super.update();
    if (this.burning) {
      const progress = 1 - this._burnTime / this.burnTime;
      this.color = pf.color(
        `hsl(${Math.floor(this.colorOffset + progress * 100) % 360},50%,${Math.floor(90 - 80 * progress * progress)}%)`
      );
      this._burnTime -= configs.delta;
      if (this._burnTime <= 0) this.extinguish();
    }
  }

  render() {
    pf.fill(this.color);
    pf.noStroke();
    pf.circle(0, 0, this.S[0]);
  }

  extinguish() {
    this.burning = false;
    this._burnTime = -1;
    this.kill();
  }

}
