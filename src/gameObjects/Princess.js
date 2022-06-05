import GameState from '../gameObjects/GameState'

class Princess {
    constructor(scene, x, y, atlasName = 'atlas') {
        const useDeadZone = false;

        this.scene = scene;

        // By using an object in tiled, you could also dynamically define the spawn point
        this.sprite = scene.physics.add.sprite(x, y, atlasName)
        this.currentAnimation = undefined
        this.flipX = false

        // this.sprite.setCollideWorldBounds(true);
        // this.sprite.isDed = false;

        // scene.cameras.main
        //     .setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels)
        //     .startFollow(this.sprite);

        // if (useDeadZone) {
        //     scene.cameras.main.setDeadzone(scene.game.config.width / 4, scene.game.config.height)
        // }

        this.currentAnimation = 'danceP_Front'
        this.currentAnimation = this.sprite.play(this.currentAnimation, true)

        this.animationCircleCnt = 0

        this.marioReachRebound = false
        this.justReachedDanceFloor = true
        this.danceFloorPositionX = 2456

        return this;
    }

    setMarioReachedRebound() {
        this.marioReachRebound = true
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.sprite, gameObject);

        return this;
    }

    update(input) {
        if(GameState.getCurrentGameState() === GameState.StateSearchingPrincess ||
        GameState.getCurrentGameState() === GameState.StateJustReachedDanceFloor || 
        GameState.getCurrentGameState() === GameState.StateReboundDancing) {
            this.danceRebound()
        }
    }

    danceRebound() {
        if(!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key === 'runP') {
            // if(this.currentAnimation === 'danceP_Front')
            //     this.currentAnimation = 'danceP_Back'
            // if(this.currentAnimation === 'danceP_Back') {
            //     this.currentAnimation = 'danceP_Front'
            //     this.flipX = !this.flipX
            // }
            this.flipX = !this.flipX
            this.sprite.setFlipX(this.flipX);
            if(this.animationCircleCnt  === 3) {
                this.currentAnimation = this.sprite.play('danceP_special', true)
                this.animationCircleCnt = -1
            }
            else
                this.currentAnimation = this.sprite.play('danceP_Front', true)
            this.animationCircleCnt += 1
        }
    }

    die() {
        this.sprite.isDed = true;
        this.sprite.setVelocity(0, -350);
        this.sprite.play('die', true);
        this.sprite.setCollideWorldBounds(false);
    }
}

export default Princess;