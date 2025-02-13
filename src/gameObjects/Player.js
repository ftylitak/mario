import GameState from "../gameObjects/GameState"

class Player {
    constructor(scene, x, y, atlasName = "atlas") {
        const useDeadZone = false

        this.scene = scene

        // By using an object in tiled, you could also dynamically define the spawn point
        this.sprite = scene.physics.add.sprite(x, y, atlasName).setScale(1.75)

        this.sprite.setCollideWorldBounds(true)
        this.sprite.isDed = false

        scene.cameras.main.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels).startFollow(this.sprite)

        if (useDeadZone) {
            scene.cameras.main.setDeadzone(scene.game.config.width / 4, scene.game.config.height)
        }

        this.jumpEnabled = true

        this.danceFloorPositionX = 2433
        this.jumpTriggersX = [2610, 2674, 2722, 2770, 2818, 2898]

        this.maxShipPosition = 3240
        this.shipPositionX = 3172
        this.islandPosition = 4145

        this.audioJump = this.scene.sound.add("jump")

        return this
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.sprite, gameObject)

        return this
    }

    update(input) {
        if (GameState.getCurrentGameState() === GameState.StateSearchingPrincess) {
            if (input.left.isDown) {
                this.sprite.setVelocityX(-200).setFlipX(true)
                this.sprite.body.onFloor() && !this.sprite.isDed && this.sprite.play("run", true)

                // this.alignSceneToPlayer()
            } else if (input.right.isDown) {
                if (this.sprite.x < this.maxShipPosition) this.sprite.setVelocityX(200).setFlipX(false)
                else this.sprite.setVelocityX(0).setFlipX(false)
                this.sprite.body.onFloor() && !this.sprite.isDed && this.sprite.play("run", true)

                //this.alignSceneToPlayer()
            } else {
                this.sprite.setVelocityX(0)
                this.sprite.body.onFloor() && !this.sprite.isDed && this.sprite.play("idle", true)
            }

            if (
                input.space.isDown &&
                this.jumpEnabled
                // && this.sprite.body.onFloor()
            ) {
                this.audioJump.play()
                this.sprite.setVelocityY(-350)
                this.sprite.play("jump", true)
                this.jumpEnabled = false
            }

            if (!input.space.isDown) this.jumpEnabled = true
        } else if (GameState.getCurrentGameState() === GameState.StateJustReachedDanceFloor) {
            //going right
            if (!this.sprite.flipX && this.sprite.x < this.danceFloorPositionX) {
                this.sprite.setVelocityX(30)
                this.sprite.play("run", true)
            }
            //going left
            else if (this.sprite.flipX && this.sprite.x > this.danceFloorPositionX) {
                this.sprite.play("run", true)
                this.sprite.setVelocityX(-30)
            } else {
                this.sprite.setVelocityX(0)
                this.sprite.play("danceM", true)
                this.sprite.setFlipX(false)
                GameState.goToNextState()
                GameState.goToNextStateTimed(5000)
            }
        } else if (
            GameState.getCurrentGameState() === GameState.StateReboundDancing ||
            GameState.getCurrentGameState() === GameState.StateFinale
        ) {
            if (!this.sprite.anims.isPlaying) {
                this.sprite.play("danceM", true)
                this.sprite.setFlipX(!this.sprite.flipX)
            }
        } else if (GameState.getCurrentGameState() === GameState.StateHeadingToShip) {
            this.sprite.setVelocityX(70).setFlipX(false)

            this.sprite.body.onFloor() && this.sprite.play("run", true)

            //this.alignSceneToPlayer()

            if (this.jumpTriggersX.includes(this.sprite.x) && this.jumpEnabled) {
                this.sprite.setVelocityY(-350)
                this.sprite.play("jump", true)
                this.jumpEnabled = false
            } else this.jumpEnabled = true

            if (this.sprite.x >= this.shipPositionX) {
                this.sprite.setVelocityX(0)
                GameState.goToNextState()
            }
        } else if (GameState.getCurrentGameState() === GameState.StateOnShipMario) {
            this.sprite.play("idle", true)
        } else if (GameState.getCurrentGameState() === GameState.StateOnShipPrincess) {
            this.sprite.play("idle", true)
            //this.sprite.setVelocityX(60).setFlipX(false);
        } else if (
            GameState.getCurrentGameState() === GameState.StateReachedCrete ||
            GameState.getCurrentGameState() === GameState.StatePrincessAtIslandPosition
        ) {
            this.sprite.setVelocityX(70).setFlipX(false)
            this.sprite.play("run", true)
            if (this.sprite.x >= this.islandPosition) {
                this.sprite.setVelocityX(0).setFlipX(false)
                this.sprite.play("idle", true)
                GameState.goToNextState()
            }
        }
        this.alignSceneToPlayer()
    }

    alignSceneToPlayer() {
        this.scene.physics.world.bounds.setPosition(this.scene.cameras.main.worldView.x, 0)
    }

    // die() {
    //     this.sprite.isDed = true;
    //     this.sprite.setVelocity(0, -350);
    //     this.sprite.play('die', true);
    //     this.sprite.setCollideWorldBounds(false);
    // }
}

export default Player
