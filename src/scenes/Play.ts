import * as Phaser from "phaser";
//import yamldata from "/assets/scenario.yaml?url";

import phoneURL from "../../public/assets/images/PhoneNew.png?url";
import rotaryURL from "../../public/assets/images/RotaryDialNew.png?url";
import numberURL from "../../public/assets/images/RotaryNumbers.png?url";

import dialStartURL from "../../public/assets/sound/RotaryDialStart.mp3?url";
import dialFinishURL from "../../public/assets/sound/RotaryDialFinish.mp3?url";
import rotaryRingURL from "../../public/assets/sound/Rotary_Ring.mp3";

import notebookURL from "../../public/assets/images/notepad.jpg?url";

import fortune1URL from "../../public/assets/sound/fortune1.wav?url";
import fortune2URL from "../../public/assets/sound/fortune2.wav?url";
import fortune3URL from "../../public/assets/sound/fortune3.wav?url";
import fortune4URL from "../../public/assets/sound/fortune4.wav?url";
import fortune5URL from "../../public/assets/sound/fortune5.wav?url";
import fortune6URL from "../../public/assets/sound/fortune6.wav?url";
import fortune7URL from "../../public/assets/sound/fortune7.wav?url";
import fortune8URL from "../../public/assets/sound/fortune8.wav?url";
import fortune9URL from "../../public/assets/sound/fortune9.wav?url";
import fortune10URL from "../../public/assets/sound/fortune10.wav?url";
import fortune11URL from "../../public/assets/sound/fortune11.wav?url";
import fortune12URL from "../../public/assets/sound/fortune12.wav?url";
import fortune13URL from "../../public/assets/sound/fortune13.wav?url";
import fortune14URL from "../../public/assets/sound/fortune14.wav?url";
import fortune15URL from "../../public/assets/sound/fortune15.wav?url";
import fortune16URL from "../../public/assets/sound/fortune16.wav?url";
import fortune17URL from "../../public/assets/sound/fortune17.wav?url";
import fortune18URL from "../../public/assets/sound/fortune18.wav?url";
import fortune19URL from "../../public/assets/sound/fortune19.wav?url";
import fortune20URL from "../../public/assets/sound/fortune20.wav?url";

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

  musicConfig = {
    mute: false,
    volume: 0.1,
    detune: 0,
    seek: 0,
    //loop: true,
    delay: 0,
  };

  dialFinish:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
    | null = null;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("phone", phoneURL);
    this.load.image("numbers", numberURL);
    this.load.image("rotary", rotaryURL);
    this.load.image("notebook", notebookURL);

    this.load.audio("startDial", dialStartURL);
    this.load.audio("endDial", dialFinishURL);
    this.load.audio("rotaryRing", rotaryRingURL);

    this.load.audio("fortune1", fortune1URL);
    this.load.audio("fortune2", fortune2URL);
    this.load.audio("fortune3", fortune3URL);
    this.load.audio("fortune4", fortune4URL);
    this.load.audio("fortune5", fortune5URL);
    this.load.audio("fortune6", fortune6URL);
    this.load.audio("fortune7", fortune7URL);
    this.load.audio("fortune8", fortune8URL);
    this.load.audio("fortune9", fortune9URL);
    this.load.audio("fortune10", fortune10URL);
    this.load.audio("fortune11", fortune11URL);
    this.load.audio("fortune12", fortune12URL);
    this.load.audio("fortune13", fortune13URL);
    this.load.audio("fortune14", fortune14URL);
    this.load.audio("fortune15", fortune15URL);
    this.load.audio("fortune16", fortune16URL);
    this.load.audio("fortune17", fortune17URL);
    this.load.audio("fortune18", fortune18URL);
    this.load.audio("fortune19", fortune19URL);
    this.load.audio("fortune20", fortune20URL);
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

    this.add
      .sprite(0, 130, "notebook")
      .setOrigin(0, 0)
      .setScale(0.4)
      .setInteractive();

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

  resetPhoneNumber() {
    this.dialedNumber = "";
    this.phoneNumberDisplay!.text = this.dialedNumber;
  }

  updatePhoneNumber(num: number) {
    //Check if audio is already playing
    if (this.phoneIsPlaying) {
      return;
    }

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
    }

    this.phoneNumberDisplay!.text = this.dialedNumber;
  }

  dialNumber(phone_number: string) {
    this.phoneIsPlaying = true;

    const validPhoneNumbers: Record<string, Audios> = {
      "666-6666": { low: 1, high: 4 },
      "111-1111": { low: 5, high: 8 },
      "222-2222": { low: 9, high: 12 },
      "333-3333": { low: 13, high: 16 },
      "444-4444": { low: 17, high: 20 },
    };

    // Let the phone ring
    const ring = this.sound.add("rotaryRing");
    ring.play(this.musicConfig);

    if (validPhoneNumbers[phone_number] == undefined) {
      ring.on("complete", () => {
        this.resetPhoneNumber();
        this.phoneIsPlaying = false;
      });
      console.log("bad number");
      return;
    }

    //Time to play a message
    //Delay ring from 3 - 9 seconds
    const lower = 3000;
    const upper = 9000;
    const delay = Math.floor(Math.random() * (upper - lower) + lower);

    //Choose a message
    const numberRange = validPhoneNumbers[phone_number];
    const message =
      "fortune" +
      Math.floor(
        Math.random() * (numberRange.high - numberRange.low) + numberRange.low,
      );

    this.time.delayedCall(delay, () => {
      ring.stop();
      const audioMessage = this.sound.add(message);
      audioMessage.play();
      audioMessage.on("complete", () => {
        this.resetPhoneNumber();
        this.phoneIsPlaying = false;
      });
    });
    console.log("Good number");
  }
}

interface Audios {
  low: number;
  high: number;
}
