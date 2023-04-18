import { Entity } from "../Entity.js";
import { randInt, randRange } from "../utils.js";
import { Particle } from "./Particle.js";

export class ExplosionEntity extends Entity {
  physics = false;
  O = [0, 0];
  S = [0, 0];
  POWER_COEFFICIENT = 5;
  power = 1;

  init() {
    const power = this.power * this.POWER_COEFFICIENT;
    const num = randInt(40, 100);
    const colorOffset = randRange(360);
    const particles = new Array(num).fill(null).map((_, i) => {
      const p = new Particle(0, 0);
      const d = Math.max(0, Math.sin(randRange(Math.PI)));
      const r = randRange(2 * Math.PI);
      p.V = [d * Math.cos(r) * power, d * Math.sin(r) * power];
      p.setColorOffset(colorOffset);
      return p;
    });
    // console.log(particles);
    this.registerChildren(...particles);
  }

  update() {
    super.update();
    this.clear();
    if (this.children.length === 0) this.kill();
  }

  setPower(p) {
    this.power = p;
  }
}
