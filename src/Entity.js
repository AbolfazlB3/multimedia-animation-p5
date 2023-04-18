import { configs, pf } from "./main.js";
import { Sprites } from "./Sprites.js";

export class Entity {
  name;
  X = [0, 0]; // location
  V = [0, 0]; // velocity
  S = [0, 0]; // size
  O = [0, 0]; // local origin
  R = 0; // rotation
  scale = 1; // scale

  dead = false;
  parent;
  children = [];
  childrenBuffer = [];
  SPRITE_NAME;
  isInitiated = false;
  physics = false;

  constructor(x, y) {
    this.X = [x ?? 0, y ?? 0];
  }

  init() {
    if (this.SPRITE_NAME) this.sprite = Sprites[this.SPRITE_NAME]?.buffer();
  }

  renderFamily() {
    pf.push();

    this.adjustRenderingTransformation();

    pf.push();
    this.render();
    pf.pop();

    pf.push();
    this.renderDebug();
    pf.pop();

    this.renderChildren();

    pf.pop();
  }

  adjustRenderingTransformation() {
    const { X } = this;
    pf.translate(X[0], -X[1]);
    pf.scale(this.scale);
    pf.rotate(this.getRotation());
  }

  adjustOriginRenderingTransformation() {
    const { S, O } = this;
    pf.translate(-O[0], O[1] - S[1]);
  }

  render() {
    if (!this.sprite) return;
    const img = this.sprite();
    const { S } = this;
    pf.push();
    this.adjustOriginRenderingTransformation();
    pf.image(img, 0, 0, S[0], S[1]);
    pf.pop();
  }

  renderDebug() {
    if (!configs.debug) return;
    const { S, O } = this;
    pf.push();
    pf.noFill();
    pf.strokeWeight(0.01);
    pf.stroke("red");
    const l = (S[1] - O[1]) * 1.5;
    pf.rect(0, -l, 0, l);
    this.adjustOriginRenderingTransformation();
    pf.stroke(100);
    pf.rect(0, 0, S[0], S[1]);
    pf.pop();
    pf.noStroke();
    pf.fill(0);
    pf.ellipse(0, 0, 0.1, 0.1);
  }

  renderChildren() {
    this.children.forEach(entity => entity.renderFamily());
  }

  updateFamily() {
    if (!this.isInitiated) {
      this.init();
      this.isInitiated = true;
    }
    this.children.push(...this.childrenBuffer);
    this.childrenBuffer = [];
    this.update();
    this.updateChildren();
  }

  update() {
    if (this.physics) {
      const { X, V } = this;
      this.X = [X[0] + V[0] * configs.delta, X[1] + V[1] * configs.delta];
      this.V = [V[0], V[1] - 9.8 * configs.delta];
    }
  }

  updateChildren() {
    this.children.forEach(entity => entity.updateFamily());
  }

  registerChildren(...children) {
    children.forEach(child => {
      child.parent = this;
    });
    this.childrenBuffer.push(...children);
  }

  getSpeed() {
    const { V } = this;
    return Math.sqrt(V[0] * V[0] + V[1] * V[1]);
  }

  getDirection() {
    const { V } = this;
    const l = this.getSpeed();
    if (l === 0) return [0, 0];
    return [V[0] / l, V[1] / l];
  }

  getHeadingRotation() {
    const res = pf.createVector(this.V[0], this.V[1]).heading() - pf.PI / 2;
    return -res;
  }

  getRotation() {
    return this.R;
  }

  kill(rec = true) {
    this.dead = true;
    if (rec) this.children.forEach(child => child.kill());
  }

  clear(rec = true) {
    if (rec) this.children.forEach(child => child.clear());
    this.children = this.children.filter(child => !child.dead);
  }

  totalEntities() {
    return 1 + this.children.map(child => child.totalEntities()).reduce((p, c) => p + c, 0);
  }
}
