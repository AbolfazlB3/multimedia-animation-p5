import { Camera } from "./Camera.js";
import { BackgroundEntity } from "./entities/Background.js";
import { RocketLauncherEntity } from "./entities/RocketLauncher.js";
import { World } from "./entities/World.js";
import { EventEmitter } from "./EventEmitter.js";
import { Sprites } from "./Sprites.js";
import { Sounds } from "./Sounds.js";
import { RocketEntity } from "./entities/Rocket.js";

const world = new World();

export let entities = [];

export const configs = {
  world,
  fps: 60,
  delta: 1 / 60,
  debug: false,
  keyboard: new EventEmitter(),
  mouse: new EventEmitter(),
};

world.registerChildren(new BackgroundEntity());
export const camera = new Camera(world, 1, 1);
const rocketLauncher = new RocketLauncherEntity();
world.registerChildren(rocketLauncher);

entities.push(world);

export const pf = new p5(p5 => {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    camera.setCameraSize(p5.windowWidth, p5.windowHeight);
    camera.setCameraLoc([(world.S[0] * world.scale) / 2, (world.S[1] * world.scale) / 2]);
    p5.frameRate(configs.fps);
  };

  p5.draw = () => {
    // p5.clear();
    p5.background(0);

    entities.forEach(entity => entity.updateFamily());
    entities.forEach(entity => entity.renderFamily());
    entities.forEach(entity => entity.clear());

    // console.log(world.totalEntities());
  };

  p5.preload = () => {
    Object.entries(Sprites).forEach(([name, value]) => {
      if (!value.readFile) return;
      const extension = value.extension ?? "png";
      try {
        const spriteSheet = p5.loadImage(`./sprites/${name}.${extension}`);
        value.spriteSheet = spriteSheet;
        if (value.animated) {
          const spriteData = p5.loadJSON(`./sprites/${name}.json`);
          value.spriteData = spriteData;
        }
      } catch (err) {}
    });
    Object.entries(Sounds).forEach(([name, value]) => {
      const extension = value.extension ?? "mp3";
      try {
        const sound = p5.loadSound(`./sounds/${name}.${extension}`);
        value.sound = sound;
        sound.setVolume(0.2);
      } catch (err) {
        console.log(err);
      }
    });
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    camera.setCameraSize(p5.windowWidth, p5.windowHeight);
  };

  let lastMousePressedFrame = -1;
  p5.mousePressed = e => {
    if (e.button === 0) {
      lastMousePressedFrame = p5.frameCount;
      configs.keyboard.emit("MOUSE_PRESSED", e);
    }
  };
  p5.mouseReleased = e => {
    const current = p5.frameCount;
    const last = lastMousePressedFrame === -1 ? current - 1 : lastMousePressedFrame;
    const X = camera.getWorldCoords([p5.mouseX, p5.mouseY]);
    const power = RocketEntity.timeToPower((current - last) * configs.delta);
    rocketLauncher.cacheAction(rl => rl.spawnAt(X, power));
    configs.keyboard.emit("MOUSE_RELEASED", e);
  };
  p5.keyPressed = () => {
    configs.keyboard.emit("KEY_PRESSED", p5.keyCode);
  };
  p5.keyReleased = () => {
    configs.keyboard.emit("KEY_RELEASED", p5.keyCode);
    const code = p5.keyCode;
    if (code === 49) rocketLauncher.cacheAction(rl => rl.spawnMultiple()); // 1
    if (code === 50) rocketLauncher.cacheAction(rl => rl.spawnInDirection("RTL")); // 2
    if (code === 51) rocketLauncher.cacheAction(rl => rl.spawnInDirection("LTR")); // 3
  };
});
