import GameState from "./GameState"

class Dancer {
    constructor(scene, x, y, atlasName, walkAnimation, danceAnimation, targetX) {
        const useDeadZone = false

        this.scene = scene

        // By using an object in tiled, you could also dynamically define the spawn point
        this.sprite = scene.physics.add.sprite(x, y, atlasName)
        this.currentAnimation = undefined
        this.flipX = false

        this.walkAnimationName = walkAnimation
        this.currentAnimation = this.sprite.play(this.walkAnimationName, true)

        this.danceAnimationName = danceAnimation

        this.animationCircleCnt = 0
        this.targetX = targetX
        this.reachedX = false
        this.princessIslandPosition = 4190

        return this
    }

    setMarioReachedRebound() {
        this.marioReachRebound = true
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.sprite, gameObject)

        return this
    }

    update() {
        if (this.sprite.x < this.targetX) {
            this.sprite.play(this.walkAnimationName, true)
            this.sprite.setVelocityX(35)
        } else {
            if (!this.reachedX) {
                this.reachedX = true
                this.sprite.setVelocityX(0)

                this.sprite.setFlipX(this.sprite.x > this.princessIslandPosition)
            }

            this.sprite.play(this.danceAnimationName, true)
        }
        //if (GameState.getCurrentGameState() == GameState.StateFinale) {

        // if (GameState.getCurrentGameState() !== GameState.StateFinale) {
        //     this.sprite.play(this.walkAnimationName, true)

        //     this.sprite.setVelocityX(70)
        // }
        // if(GameState.getCurrentGameState() === GameState.StateSearchingPrincess ||
        // GameState.getCurrentGameState() === GameState.StateJustReachedDanceFloor ||
        // GameState.getCurrentGameState() === GameState.StateReboundDancing ||
        // GameState.getCurrentGameState() === GameState.StateFinale) {
        //     this.danceRebound()
        // }
        // else if(GameState.getCurrentGameState() === GameState.StateHeadingToShip ||
        //          GameState.getCurrentGameState() === GameState.StateOnShipMario) {
        //     this.sprite.setVelocityX(70).setFlipX(false);
        //     this.sprite.body.onFloor() && this.sprite.play('runP', true);
        //     if(this.jumpTriggersX.includes(this.sprite.x) && this.jumpEnabled) {
        //         this.sprite.setVelocityY(-350);
        //         this.sprite.play('jumpP', true);
        //         this.jumpEnabled = false
        //     }
        //     else this.jumpEnabled = true
        //     if(this.sprite.x >= this.shipPositionX) {
        //         this.sprite.setVelocityX(0);
        //         GameState.goToNextState()
        //     }
        // }
        // else if(GameState.getCurrentGameState() === GameState.StateOnShipPrincess) {
        //     this.sprite.play('idleP', true);
        //     //this.sprite.setVelocityX(60).setFlipX(false);
        // }
        // else if (GameState.getCurrentGameState() === GameState.StateReachedCrete) {
        //     this.sprite.setVelocityX(70).setFlipX(false);
        //     this.sprite.play('runP', true);
        //     console.log("Princess x: ", this.sprite.x)
        //     if(this.sprite.x >= this.islandPosition) {
        //         this.sprite.setVelocityX(0).setFlipX(true);
        //         this.sprite.play('idleP', true);
        //         GameState.goToNextState()
        //     }
        // }
    }

    danceRebound() {
        if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key === "runP") {
            // if(this.currentAnimation === 'danceP_Front')
            //     this.currentAnimation = 'danceP_Back'
            // if(this.currentAnimation === 'danceP_Back') {
            //     this.currentAnimation = 'danceP_Front'
            //     this.flipX = !this.flipX
            // }
            this.flipX = !this.flipX
            this.sprite.setFlipX(this.flipX)
            if (this.animationCircleCnt === 3) {
                this.currentAnimation = this.sprite.play("danceP_special", true)
                this.animationCircleCnt = -1
            } else this.currentAnimation = this.sprite.play("danceP_Front", true)
            this.animationCircleCnt += 1
        }
    }
}

export default Dancer
