import * as Phaser from "phaser";
//import yamldata from "/assets/scenario.yaml?url";

import phoneURL from "../../public/assets/images/PhoneNew.png?url";
import rotaryURL from "../../public/assets/images/RotaryDialNew.png?url";
import numberURL from "../../public/assets/images/RotaryNumbers.png?url";
import dialStartURL from "../../public/assets/sound/RotaryDialStart.mp3?url";
import dialFinishURL from "../../public/assets/sound/RotaryDialFinish.mp3?url";

export default class Play extends Phaser.Scene {
  // Declare class properties
  phone: Phaser.GameObjects.Sprite | undefined;
  rotary: Phaser.GameObjects.Sprite | undefined;
  keyA?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  keyLEFT?: Phaser.Input.Keyboard.Key;
  keyRIGHT?: Phaser.Input.Keyboard.Key;

  pointerIsDown: boolean = false;
  pointerStartAngle = 0;

  phoneIsPlaying: boolean = false;

  dialedNumber: string = "";
  phoneNumberDisplay: Phaser.GameObjects.Text | null = null;

  dialFinish:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
    | null = null;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("phone", phoneURL);
    this.load.image("numbers", numberURL);
    this.load.image("rotary", rotaryURL);
    this.load.audio("startDial", dialStartURL);
    this.load.audio("endDial", dialFinishURL);

    /*let musicConfig = {
      mute: false,
      volume: 0.1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }*/
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    const width: number = this.game.config.width as number;
    const height: number = this.game.config.height as number;
    //let numbersDialed: number[];
    const dialStart = this.sound.add("startDial");
    this.dialFinish = this.sound.add("endDial");

    this.phone = this.add
      .sprite(width / 2, height / 2, "phone")
      .setOrigin(0.5, 0.5)
      .setScale(0.6);

    this.add
      .sprite(width / 2 + 16, height / 2 - 135, "numbers")
      .setOrigin(0.5, 0.5)
      .setScale(0.6)
      .setInteractive();

    this.rotary = this.add
      .sprite(width / 2 + 16, height / 2 - 135, "rotary")
      .setOrigin(0.5, 0.5)
      .setScale(0.6)
      .setInteractive();

    this.phoneNumberDisplay = this.add
      .text(width / 2 - 100, (height / 3) * 2, "")
      .setFontSize(50)
      .setColor("#1b0000");

    this.keyA = this.#addKey("A");
    this.keyD = this.#addKey("D");
    this.keyLEFT = this.#addKey("LEFT");
    this.keyRIGHT = this.#addKey("RIGHT");

    this.rotary.on("pointerdown", () => {
      this.pointerIsDown = true;
      this.pointerStartAngle = this.getAngleBetween(
        this.rotary!.x,
        this.rotary!.y,
        this.input.x,
        this.input.y,
      );
      dialStart.play();
    });

    this.rotary.on("pointerup", () => {
      if (this.pointerIsDown == true) {
        dialStart.stop();
        this.dialFinish!.play();
        this.getNumberFromRotary();
      }
      this.pointerIsDown = false;
    });

    this.input.on("pointerup", () => {
      if (this.pointerIsDown == true) {
        dialStart.stop();
        this.dialFinish!.play();
        this.getNumberFromRotary();
      }
      this.pointerIsDown = false;
    });
  }

  // eslint-disable-next-line no-unused-vars
  update(_timeMs: number, _delta: number) {
    if (this.pointerIsDown) {
      const angle = this.getAngleBetween(
        this.rotary!.x,
        this.rotary!.y,
        this.input.x,
        this.input.y,
      );

      const diff = this.pointerStartAngle - angle;

      this.rotary!.angle = -diff + 360;
    } else {
      if (this.rotary!.angle < -1) {
        this.rotary!.angle -= 0.75;
      } else if (this.rotary!.angle > 1) {
        this.rotary!.angle -= 0.75;
      } else {
        this.dialFinish?.stop();
        this.rotary!.angle = 0;
      }
    }
  }

  getAngleBetween(x1: number, y1: number, x2: number, y2: number): number {
    let angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
    angle = (angle * 360) / (2 * Math.PI) - 35;
    return angle;
  }
  getNumberFromRotary() {
    let angle = Math.floor(this.rotary!.angle);
    console.log(angle);

    if (angle < 0) {
      angle += 360;
    }
    if (angle < 45) {
      return;
    }

    const number = (Math.floor((angle + 15) / 30) - 1) % 10;
    this.updatePhoneNumber(number);
    return number;
  }

  updatePhoneNumber(num: number) {
    //Check if audio is already playing

    //prevents multiple plays if audio is playing
    /*if(!this.music.isPlaying) {
      this.music.play(musicConfig);
    }*/

    this.dialedNumber += num.toString();
    if (this.dialedNumber.length == 3) {
      this.dialedNumber += "-";
    }
    if (this.dialedNumber.length >= 8) {
      this.dialNumber(this.dialedNumber);
      this.dialedNumber = "";
    }

    this.phoneNumberDisplay!.text = this.dialedNumber;
  }

  dialNumber(str: string) {
    console.log(str);
  }
}
