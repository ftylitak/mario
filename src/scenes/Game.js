import Player from '../gameObjects/Player'
import Princess from '../gameObjects/Princess'
import Debugger from '../gameObjects/Debugger'
import Goomba from '../gameObjects/Goomba'
import Coin from '../gameObjects/Coin'
import StaticObjects from '../gameObjects/StaticObjects'
import Flag from '../gameObjects/Flag'

import tiles from '../config/tiles'
import generateAnimations from '../config/animations'

class Game extends Phaser.Scene {

    constructor () {
        super('Game');
    }

    // Tileset by https://www.deviantart.com/thecrushedjoycon/art/Super-Mario-Bros-Mega-Tileset-Ver-2-842092790
    // Goombas are from https://mfgg.net/index.php?act=resdb&param=02&c=1&id=4200
    // Mario from https://www.mariomayhem.com/downloads/sprites/super_mario_bros_sprites.php
    // Atlas generated by https://gammafp.github.io/atlas-packer-phaser/editor
    preload() {
        this.load.image('tiles', './assets/tiles.png');
        this.load.image('bar-Tiles', './assets/bar-Tiles.png');
        this.load.image('bar-items', './assets/bar-2-tiles.png');
        this.load.tilemapTiledJSON('map', './assets/map.json');
        this.load.atlas('atlas', './assets/mario-atlas.png','./assets/mario-atlas.json');
        this.load.atlas('atlasP', './assets/princess-atlas-2.png','./assets/princess_atlas_name.json');

        this.isDay = "day" 
        this.load.image(`background-${this.isDay}-1`, `./assets/background-${this.isDay}-1.png`)
        this.load.image(`background-${this.isDay}-2`, `./assets/background-${this.isDay}-2.png`)
        this.load.image(`background-${this.isDay}-3`, `./assets/background-${this.isDay}-3.png`)
        this.load.image(`background-${this.isDay}-4`, `./assets/background-${this.isDay}-4.png`)
        this.load.image(`background-${this.isDay}-5`, `./assets/background-${this.isDay}-5.png`)

        this.load.on('complete', () => {
            generateAnimations(this);
        });
    }

    create() {
        const noCollisionTiles = [
            tiles.EMPTY,
            tiles.FLAG_LEFT
        ];

        this.map = this.make.tilemap({ key: 'map' });
        
        //non-scrolling
        const width = this.scale.width
        const height = this.scale.height
        this.add.image(width*0.5, height*0.5, `background-${this.isDay}-1`).setScrollFactor(0)

        //scrolling
        this.add.image(0+200, height-100, `background-${this.isDay}-2`)
                .setOrigin(0, 1)
                .setScrollFactor(0.25)

        this.add.image(0+300, height-200, `background-${this.isDay}-3`)
        //.setOrigin(0, 0)
        .setScrollFactor(0.3)

        this.add.image(0+400, height-200, `background-${this.isDay}-4`)
        //.setOrigin(0, 0)
        .setScrollFactor(0.4)

        this.add.image(0+500, height-200, `background-${this.isDay}-5`)
        //.setOrigin(0, 0)
        .setScrollFactor(0.5)
        //tiles

        this.tileset = this.map.addTilesetImage('map-tileset', 'tiles');
        this.barTileset = this.map.addTilesetImage('bar-tiles', 'bar-Tiles');
        this.barItemTileset = this.map.addTilesetImage('bar-items-tileset', 'bar-items');

        this.map.createStaticLayer('background-background', this.barTileset, 0, -16);

        this.platform = this.map.createStaticLayer('platform', this.tileset, 0, 0);
        this.ship = this.map.createStaticLayer('ship', this.tileset, 0, 0);

        this.map.createStaticLayer('background', this.tileset, 0, 0);
        this.map.createStaticLayer('background-bar-tiles', this.barTileset, 0, -16);
        this.map.createStaticLayer('background-bar-tiles-foreground', this.barTileset, 0, -16);
        this.map.createStaticLayer('background-bar-item-tiles', this.barItemTileset, 0, 0);
        this.map.createStaticLayer('background-bar-item-foreground-tiles', this.barItemTileset, 0, 0);
        this.platform.setCollisionByExclusion(noCollisionTiles, true);
        this.ship.setCollisionByExclusion(noCollisionTiles, true);

        this.staticObjects = new StaticObjects(this)

        this.player = new Player(this, 60, 310).collideWith(this.platform).collideWith(this.ship);
        this.princess = new Princess(this, 2483, 430, 'atlasP').collideWith(this.platform).collideWith(this.ship);
        //this.princess = new Princess(this, 284, 310, 'atlasP').collideWith(this.platform).collideWith(this.ship);
        this.goombas = new Goomba(this).collideWith(this.platform);
        this.coins = new Coin(this).collideWith(this.player.sprite);
        this.flag = new Flag(this);
        this.debugger = new Debugger(this);
        

        this.inputs = this.input.keyboard.createCursorKeys();
    }
    
    update() {
        this.player.update(this.inputs);
        this.princess.update(this.inputs);
        this.goombas.update();
        this.coins.update();
        this.debugger.debuggerEnabled && this.debugger.update();
    }
}

export default Game;