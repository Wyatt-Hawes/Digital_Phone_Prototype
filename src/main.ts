import * as Phaser from "phaser";
//import yamldata from "/assets/scenario.yaml?url";
import Menu from "./scenes/Menu";
import Play from "./scenes/Play";

const config: Phaser.Types.Core.GameConfig = {
  scene: [Menu, Play],
  backgroundColor: "#FFFFFF",
  scale: {
    width: 640,
    height: 640,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

document.title = "Phone Prototype";
document.body.style.backgroundColor = "beige";

new Phaser.Game(config);
