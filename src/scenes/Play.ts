import * as Phaser from "phaser";
//import yamldata from "/assets/scenario.yaml?url";

import Phone from "public/assets/images/Phone.jpg";
import Rotary from "public/assets/images/RotarySpin.png";




export default class Play extends Phaser.Scene {
  // Declare class properties
  rotary?: Phaser.GameObjects.Sprite;
  keyA?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  keyLEFT?: Phaser.Input.Keyboard.Key;
  keyRIGHT?: Phaser.Input.Keyboard.Key;


  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("rotary", Rotary);
    this.load.image("phone", Phone);  }
    

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.keyA = this.#addKey("A");
    this.keyD = this.#addKey("D");
    this.keyLEFT = this.#addKey("LEFT");
    this.keyRIGHT = this.#addKey("RIGHT");

    this.rotary = this.add.sprite(670, 660, "rotary").setOrigin(0.5).setScale(1.8);

  }

  update(_timeMs: number, delta: number) {
    // if(this.input.keyboard.checkDown(keyA) || this.input.keyboard.checkDown(keyLEFT)){
    //   console.log("left down");
    //   if (this.rotary.angle >= -30) this.rotary.angle -= 0.5;
    // } else if (this.input.keyboard.checkDown(keyD) || this.input.keyboard.checkDown(keyRIGHT)){
    //   console.log("right down");
    //   if (this.rotary.angle <= 30) this.rotary.angle += 0.5;
    // } else {
    //   if (this.rotary.angle < -1) this.rotary.angle += 0.5;
    //   else if (this.rotary.angle > 1) this.rotary.angle -= 0.5;
    //   else(this.rotary.angle = 0);
    //}
  }
}
