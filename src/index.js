import Phaser from "phaser"

import Game from "./scenes/Game.js"
import GameOver from "./scenes/GameOver.js"

import "./assets/scss/index.scss"

let sizeRatio = 1

if (window.innerHeight >= 700 && window.innerHeight < 900) {
    sizeRatio += (0.5 * (900 - window.innerHeight)) / 300
} else if (window.innerHeight > 900) sizeRatio += 0.5

//can be merged
// if (widthRatio <= 0 && heightRatio >= 0) sizeRatio = (1.5 * window.innerWidth) / 1200
// else if (widthRatio >= 0 && heightRatio >= 0) sizeRatio = (1.5 * window.innerHeight) / 900
// else if (widthRatio > 0 && heightRatio > 0)
//     sizeRatio = 1.5 * (widthRatio <= heightRatio ? window.innerWidth / 1200 : window.innerHeight / 900)
// else if (widthRatio < 0 && heightRatio < 0)
//     sizeRatio = 1.5 * (widthRatio <= heightRatio ? window.innerHeight / 900 : window.innerWidth / 1200)
// console.log("zoom level: ", sizeRatio)

const config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    parent: "mario",
    backgroundColor: "#A4D3DA",
    title: "Tilemap",
    url: "webtips.dev",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            // debug: true, // Set it to true if you want debugger enabled by default
            gravity: {
                y: 1000
            }
        }
    },
    scene: [Game, GameOver],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,
        // width: 1200 * sizeRatio,
        // height: 900 * sizeRatio

        // Minimum size
        min: {
            width: 240,
            height: 180
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 1600,
            height: 1200
        },
        // Or set maximum size like these
        // maxWidth: 1600,
        // maxHeight: 1200,

        zoom: sizeRatio
    },
    render: {
        pixelArt: true
    },
    autoRound: false
}

new Phaser.Game(config)
