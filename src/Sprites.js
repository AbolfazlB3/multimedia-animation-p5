import { configs } from "./main.js";
import { cacheFn, randInt } from "./utils.js";

const loadData = name => {
  const spriteSheet = Sprites[name].spriteSheet;
  const spriteData = Sprites[name].spriteData;
  const animation = [];
  let { frames, width, height, fps } = spriteData;
  for (let i = 0; i < frames; i++) {
    let img = spriteSheet.get(width * i, 0, width, height);
    animation.push(img);
  }
  return { animation, frames, width, height, fps };
};

const cachedLoadData = cacheFn(loadData);

function getFrameProvider(name) {
  const { animation, frames, width, height, fps } = cachedLoadData(name);
  const spriteDelta = 1 / (fps || 12);
  let index = randInt(frames);
  let spent = 0;
  return function frameProvider() {
    let current = index;
    spent += configs.delta;
    if (spent >= spriteDelta) {
      spent -= spriteDelta;
      index = (index + 1) % frames;
    }
    return animation[current];
  };
}

function getImageProvider(name) {
  return () => Sprites[name].spriteSheet;
}

const animator = name => () => getFrameProvider(name);

const still = arg => {
  if (typeof arg === "string") return () => getImageProvider(arg);
  const fn = cacheFn(arg);
  return () => fn;
};

export const Sprites = {
  fire: {
    buffer: animator("fire"),
    readFile: true,
    animated: true,
  },
  rocket_1: {
    buffer: still("rocket_1"),
    readFile: true,
  },
  rocket_2: {
    buffer: still("rocket_2"),
    readFile: true,
  },
  rocket_3: {
    buffer: still("rocket_3"),
    readFile: true,
  },
  rocket_4: {
    buffer: still("rocket_4"),
    readFile: true,
  },
  background_1: {
    buffer: still("background_1"),
    readFile: true,
    extension: "jpg",
  },
  background_2: {
    buffer: still("background_2"),
    readFile: true,
    extension: "png",
  },
  background_3: {
    buffer: still("background_3"),
    readFile: true,
    extension: "webp",
  },
  background_4: {
    buffer: still("background_4"),
    readFile: true,
    extension: "jpg",
  },
};
