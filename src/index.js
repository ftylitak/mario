
import Phaser from 'phaser'

import Game from './scenes/Game.js'
import GameOver from './scenes/GameOver.js'

import './assets/scss/index.scss'

const config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    parent: 'mario',
    backgroundColor: '#A4D3DA',
    title: 'Tilemap',
    url: 'webtips.dev',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true, // Set it to true if you want debugger enabled by default
            gravity: {
                y: 1000
            }
        }
    },
    scene: [
        Game,
        GameOver
    ],
    scale: {

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 800,
            height: 600
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

        zoom: 1.5,  // Size of game canvas = game size * zoom
    },
    render: {
        pixelArt: true
      },
    autoRound: false
};

new Phaser.Game(config);
