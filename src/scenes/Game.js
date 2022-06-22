import Player from "../gameObjects/Player"
import Princess from "../gameObjects/Princess"
import Debugger from "../gameObjects/Debugger"
import Goomba from "../gameObjects/Goomba"
import Coin from "../gameObjects/Coin"
import StaticObjects from "../gameObjects/StaticObjects"
import Trigger from "../gameObjects/Trigger"
import GameState from "../gameObjects/GameState"
import Dialog from "../gameObjects/Dialog"

import tiles from "../config/tiles"
import generateAnimations from "../config/animations"
import Bubble from "../gameObjects/Bubble"
import Dancer from "../gameObjects/Dancer"

import Mark from "../gameObjects/Mark"

import data from "../dialogText"

class Game extends Phaser.Scene {
    constructor() {
        super("Game")
    }

    // Tileset by https://www.deviantart.com/thecrushedjoycon/art/Super-Mario-Bros-Mega-Tileset-Ver-2-842092790
    // Goombas are from https://mfgg.net/index.php?act=resdb&param=02&c=1&id=4200
    // Mario from https://www.mariomayhem.com/downloads/sprites/super_mario_bros_sprites.php
    // Atlas generated by https://gammafp.github.io/atlas-packer-phaser/editor
    preload() {
        var progressBar = this.add.graphics()
        var progressBox = this.add.graphics()
        var width = this.cameras.main.width
        var height = this.cameras.main.height

        progressBox.fillStyle(0x222222, 0.8)
        progressBox.fillRect(width / 4, 265, width / 2, 50)

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading...",
            style: {
                font: "20px monospace",
                fill: "#ffffff"
            }
        })
        loadingText.setOrigin(0.5, 0.5)

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: "0%",
            style: {
                font: "18px monospace",
                fill: "#ffffff"
            }
        })
        percentText.setOrigin(0.5, 0.5)

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: "",
            style: {
                font: "18px monospace",
                fill: "#ffffff"
            }
        })
        assetText.setOrigin(0.5, 0.5)

        this.load.on("progress", function (value) {
            percentText.setText(parseInt(value * 100) + "%")
            progressBar.clear()
            progressBar.fillStyle(0xffffff, 1)
            progressBar.fillRect(width / 4 + 10, 275, (width / 2 - 20) * value, 30)
        })

        this.load.on("fileprogress", function (file) {
            assetText.setText("Loading asset: " + file.key)
        })

        this.load.image("tiles", "./assets/tiles.png")
        this.load.image("bar-Tiles", "./assets/bar-Tiles.png")
        this.load.image("bar-items", "./assets/bar-2-tiles.png")
        this.load.image("beach-items", "./assets/beach_tileset.png")
        this.load.tilemapTiledJSON("map", "./assets/map.json")
        this.load.atlas("atlas", "./assets/mario-atlas.png", "./assets/mario-atlas.json")
        this.load.atlas("atlasP", "./assets/princess-atlas-2-alt.png", "./assets/princess_atlas_name.json")
        this.load.atlas("atlasDancers", "./assets/dancersAtlas.png", "./assets/dancersAtlas.json")

        this.isDay = "day"
        this.load.image(`background-${this.isDay}-1`, `./assets/background-${this.isDay}-1.png`)
        this.load.image(`background-${this.isDay}-2`, `./assets/background-${this.isDay}-2.png`)
        this.load.image(`background-${this.isDay}-3`, `./assets/background-${this.isDay}-3.png`)
        this.load.image(`background-${this.isDay}-4`, `./assets/background-${this.isDay}-4.png`)
        this.load.image(`background-${this.isDay}-5`, `./assets/background-${this.isDay}-5.png`)

        this.load.audio("main", ["./assets/main.mp3"])
        this.load.audio("jump", ["./assets/jump.wav"])
        this.load.audio("rebound", ["./assets/reboundMusic.mp3"])
        this.load.audio("blip", ["./assets/blip.mp3"])

        this.load.on("complete", () => {
            progressBar.destroy()
            progressBox.destroy()
            loadingText.destroy()
            percentText.destroy()
            assetText.destroy()
            generateAnimations(this)
        })

        this.overlapCollider = undefined
        this.overlapTriggered = false
    }

    create() {
        const noCollisionTiles = [tiles.EMPTY, tiles.FLAG_LEFT]

        this.map = this.make.tilemap({ key: "map" })

        //non-scrolling
        const width = this.scale.width
        const height = this.scale.height
        this.add.image(width * 0.5, height * 0.5, `background-${this.isDay}-1`).setScrollFactor(0)

        //scrolling
        this.add
            .image(0 + 200, height - 100, `background-${this.isDay}-2`)
            .setOrigin(0, 1)
            .setScrollFactor(0.25)

        this.add
            .image(0 + 300, height - 200, `background-${this.isDay}-3`)
            //.setOrigin(0, 0)
            .setScrollFactor(0.3)

        this.add
            .image(0 + 400, height - 200, `background-${this.isDay}-4`)
            //.setOrigin(0, 0)
            .setScrollFactor(0.4)

        this.add
            .image(0 + 500, height - 200, `background-${this.isDay}-5`)
            //.setOrigin(0, 0)
            .setScrollFactor(0.5)
        //tiles

        this.tileset = this.map.addTilesetImage("map-tileset", "tiles")
        this.barTileset = this.map.addTilesetImage("bar-tiles", "bar-Tiles")
        this.barItemTileset = this.map.addTilesetImage("bar-items-tileset", "bar-items")
        this.beachTileset = this.map.addTilesetImage("beach-tileset", "beach-items")

        this.map.createStaticLayer("background-lvl2-bar", this.barTileset, 0, -16)
        this.map.createStaticLayer("background-lvl2-map", this.tileset, 0, 0)

        this.platform = this.map.createStaticLayer("platform", this.tileset, 0, 0)
        this.ship = this.map.createStaticLayer("ship", this.tileset, 0, 0)

        this.map.createStaticLayer("background", this.tileset, 0, 0)
        this.map.createStaticLayer("beachBar", this.beachTileset, 0, 0)
        this.map.createStaticLayer("beachBar-foreground", this.beachTileset, 0, 0)
        this.map.createStaticLayer("background-bar-tiles", this.barTileset, 0, -16)
        this.map.createStaticLayer("background-bar-tiles-foreground", this.barTileset, 0, -16)
        this.map.createStaticLayer("background-bar-item-tiles", this.barItemTileset, 0, 0)
        this.map.createStaticLayer("background-bar-item-foreground-tiles", this.barItemTileset, 0, 0)
        this.platform.setCollisionByExclusion(noCollisionTiles, true)
        this.ship.setCollisionByExclusion(noCollisionTiles, true)

        this.staticObjects = new StaticObjects(this)

        //this.player = new Player(this, 2070, 210).collideWith(this.platform).collideWith(this.ship)
        this.player = new Player(this, 90, 310).collideWith(this.platform).collideWith(this.ship)
        this.princess = new Princess(this, 2462, 430, "atlasP").collideWith(this.platform).collideWith(this.ship)
        //this.princess = new Princess(this, 284, 310, 'atlasP').collideWith(this.platform).collideWith(this.ship);
        this.goombas = new Goomba(this).collideWith(this.platform)
        this.coins = new Coin(this).collideWith(this.player.sprite)
        // this.debugger = new Debugger(this);
        this.triggers = new Trigger(this).collideWith(this.player.sprite)
        this.bubble = new Bubble(this)
        this.bubble.startAnimation()

        this.inputs = this.input.keyboard.createCursorKeys()

        this.shipTargetX = 540
        this.shipGoesDown = true

        this.dialog = new Dialog(this)

        this.finaleInitialized = false

        this.musicMain = this.sound.add("main")
        this.musicRebound = this.sound.add("rebound")
        this.musicMain.play()
        this.musicRebound.play()
    }

    moveMark(mark) {
        if (mark.getTicks() % 4 === 0) {
            mark.sprt.x += mark.markGoesRight ? 1 : -1
        }

        if (mark.getTicks() % 40 === 0) {
            mark.markGoesRight = !mark.markGoesRight
        }

        if (mark.getTicks() % 8 === 0) {
            mark.sprt.y -= 1
        }

        if (mark.getTicks() % 150 === 0) mark.sprt.setVisible(false)
    }

    syncAudio(playerPositionX) {
        if (playerPositionX < 1930) {
            if (!this.musicMain.isPlaying) this.musicMain.resume()
            if (this.musicRebound.isPlaying) this.musicRebound.pause()
        } else {
            if (this.musicMain.isPlaying) this.musicMain.pause()
            if (!this.musicRebound.isPlaying) this.musicRebound.resume()
        }
    }

    update(time, delta) {
        this.player.update(this.inputs)
        this.princess.update(this.inputs)
        this.goombas.update()
        this.coins.update()

        if (this.dancers) {
            for (const dancer of this.dancers) {
                dancer.update()
            }
        }

        this.syncAudio(this.player.sprite.x)

        if (GameState.getCurrentGameState() === GameState.StateReboundDancing) {
            if (!this.mark1 || !this.mark2) {
                this.mark1 = new Mark(this, 2429)
                this.mark2 = new Mark(this, 2452)
            } else {
                this.mark1.update()
                this.mark2.update()

                this.moveMark(this.mark1)
                this.moveMark(this.mark2)
            }
        } else if (GameState.getCurrentGameState() === GameState.StateOnShipPrincess) {
            this.ship.x += 1

            let speedCorrection = 1000 / 60 / delta
            this.player.sprite.setVelocityX(60 * speedCorrection)
            this.princess.sprite.setVelocityX(60 * speedCorrection)

            if (this.ship.x >= this.shipTargetX) {
                this.player.sprite.setVelocityX(0)
                this.princess.sprite.setVelocityX(0)
                GameState.goToNextState()
            }
            if (this.ship.x % 8 === 0 && (this.ship.x < 485 || this.ship.y !== 0)) {
                this.ship.y += this.shipGoesDown ? 1 : -1
            }
            if (this.ship.x % 40 === 0) {
                this.shipGoesDown = !this.shipGoesDown
            }

            this.shipYState++
        } else if (GameState.getCurrentGameState() === GameState.StateFinale) {
            if (!this.finaleInitialized) {
                this.dialog.init()
                this.dialog.setText(data.text, true)
                this.finaleInitialized = true

                this.dancers = [
                    new Dancer(this, 3687, 250, "atlasDancers", "luigiWalk", "luigiDance", 4224)
                        .collideWith(this.platform)
                        .collideWith(this.ship),
                    new Dancer(this, 3740, 250, "atlasDancers", "mushWalk", "mushDance", 4255)
                        .collideWith(this.platform)
                        .collideWith(this.ship),
                    new Dancer(this, 3812, 250, "atlasDancers", "barioWalk", "barioDance", 4096)
                        .collideWith(this.platform)
                        .collideWith(this.ship),
                    new Dancer(this, 3780, 250, "atlas", "goombaRun", "goombaRun", 4300)
                        .collideWith(this.platform)
                        .collideWith(this.ship),
                    new Dancer(this, 3710, 250, "atlas", "goombaRun", "goombaRun", 4000)
                        .collideWith(this.platform)
                        .collideWith(this.ship)
                ]
            }
        }
    }

    trigger() {
        console.log("triggered!")
    }
}

export default Game
