export class Camera {
  F = [1600, 900]; // pixel size of the camera frame
  X = [0, 0]; // world location of camera's center of view
  S = 100; // scale level of camera (pixels per meter)
  Z = 1; // zoom level of camera

  constructor(world, w = 1600, h = 900) {
    this.setWorld(world);
    this.setCameraSize(w, h);
  }

  setCameraSize(w = 1600, h = 900) {
    this.F = [w, h];
    this.hF = [w / 2, h / 2];
    this.updateCameraScale();
  }

  setWorld(world) {
    this.world = world;
  }

  updateCameraScale() {
    const w = this.world.S[0] || 1;
    const h = this.world.S[1] || 1;
    const { F } = this;
    this.S = Math.min(F[0] / w, F[1] / h);
  }

  getScale() {
    return this.S * this.Z;
  }

  getFrameCoords(X) {
    const s = this.getScale();
    const { X: O, hF } = this;
    return [(X[0] - O[0]) * s + hF[0], -(X[1] - O[1]) * s + hF[1]];
  }

  getWorldCoords(X) {
    const s = this.getScale();
    const { X: O, hF } = this;
    return [(X[0] - hF[0]) / s + O[0], -(X[1] - hF[1]) / s + O[1]];
  }

  setCameraLoc(X) {
    this.X = X;
  }
}
