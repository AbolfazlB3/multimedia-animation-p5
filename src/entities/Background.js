import { Entity } from "../Entity.js";
import { configs, pf } from "../main.js";
import { randInt } from "../utils.js";

export class BackgroundEntity extends Entity {
  X = [0, 0];
  O = [0, 0];
  physics = false;

  constructor(...args) {
    super(...args);
    this.S = [...configs.world.S];
    this.O = [0, 0];
    this.SPRITE_NAME = randInt(2) ? "background_4" : `background_${randInt(1, 5)}`;
  }

}
