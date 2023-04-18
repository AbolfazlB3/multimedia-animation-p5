import { Entity } from "../Entity.js";
import { camera, pf } from "../main.js";

export class World extends Entity {
  X = [0, 0];
  V = [0, 0];
  S = [(16 * 200) / 9, 200];
  O = [0, 0];
  scale = 1;

  adjustRenderingTransformation() {
    const Y = camera.getFrameCoords(this.X);
    pf.translate(Y[0], Y[1]);
    pf.scale(camera.getScale());
    const { X } = this;
    pf.translate(X[0], X[1]);
    pf.scale(this.scale);
    pf.rotate(this.getRotation());
  }

  update() {}
}
