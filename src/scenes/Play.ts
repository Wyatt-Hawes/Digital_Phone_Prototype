import * as Phaser from "phaser";
import yamldata from "/assets/scenario.yaml?url";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("rotary", "./assets/RotarySpin.png");
    this.load.image("phone", "./assets/Phone.jpg");
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    keyA = this.#addKey("A");
    keyD = this.#addKey("D");
    keyLEFT = this.#addKey("LEFT");
    keyRIGHT = this.#addKey("RIGHT");

    this.rotary = this.add.sprite(670, 660, "rotary").setOrigin(0.5).setScale(1.8);

    //this.spinner = this.add.rectangle(100, 100, 50, 50, 0xff0000);
  }

  update(_timeMs: number, delta: number) {
    if(this.input.keyboard.checkDown(keyA) || this.input.keyboard.checkDown(keyLEFT)){
      console.log("left down");
      if (this.rotary.angle >= -30) this.rotary.angle -= 0.5;
    } else if (this.input.keyboard.checkDown(keyD) || this.input.keyboard.checkDown(keyRIGHT)){
      console.log("right down");
      if (this.rotary.angle <= 30) this.rotary.angle += 0.5;
    } else {
      if (this.rotary.angle < -1) this.rotary.angle += 0.5;
      else if (this.rotary.angle > 1) this.rotary.angle -= 0.5;
      else(this.rotary.angle = 0);
    }
  }
}
