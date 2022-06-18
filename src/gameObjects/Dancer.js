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

        this.goesLeft = Math.floor(Math.random(100) * 100) % 2 === 0
        this.tickCount = Math.floor(Math.random(100) * 100)

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
        if (!this.reachedX && this.sprite.x < this.targetX) {
            this.sprite.play(this.walkAnimationName, true)
            this.sprite.setVelocityX(35)
        } else {
            if (!this.reachedX) {
                this.reachedX = true
                this.sprite.setVelocityX(0)

                this.sprite.setFlipX(this.sprite.x > this.princessIslandPosition)
            } else {
                this.sprite.play(this.danceAnimationName, true)

                if (this.tickCount % 100 === 0) {
                    this.sprite.setFlipX(this.goesLeft)
                    this.goesLeft = !this.goesLeft
                }
            }
        }
        this.tickCount++
    }
}

export default Dancer
