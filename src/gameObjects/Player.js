import GameState from '../gameObjects/GameState'

class Player {
    constructor(scene, x, y, atlasName = 'atlas') {
        const useDeadZone = false;

        this.scene = scene;

        // By using an object in tiled, you could also dynamically define the spawn point
        this.sprite = scene.physics.add.sprite(x, y, atlasName)
            .setScale(1.75);

        this.sprite.setCollideWorldBounds(true);
        this.sprite.isDed = false;

        scene.cameras.main
            .setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels)
            .startFollow(this.sprite);

        if (useDeadZone) {
            scene.cameras.main.setDeadzone(scene.game.config.width / 4, scene.game.config.height)
        }

        this.jumpEnabled = true

        this.danceFloorPositionX = 2433
        this.jumpTriggersX = [
            2610,
            2674,
            2722,
            2770,
            2818,
            2898
        ]

        this.shipPositionX = 3172

        console.log("player game state: ", GameState.getCurrentGameState())

        return this;
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.sprite, gameObject);

        return this;
    }

    update(input) {
        if(GameState.getCurrentGameState() === GameState.StateSearchingPrincess) {
            if (input.left.isDown) {
                this.sprite.setVelocityX(-200).setFlipX(true);
                this.sprite.body.onFloor() && 
                !this.sprite.isDed && this.sprite.play('run', true);

                this.scene.physics.world.bounds.setPosition(this.scene.cameras.main.worldView.x, 0);
            } else if (input.right.isDown) {
                this.sprite.setVelocityX(200).setFlipX(false);
                this.sprite.body.onFloor() &&
                !this.sprite.isDed && this.sprite.play('run', true);
            
                this.scene.physics.world.bounds.setPosition(this.scene.cameras.main.worldView.x, 0);
            } else {
                this.sprite.setVelocityX(0);
                this.sprite.body.onFloor() &&
                !this.sprite.isDed && this.sprite.play('idle', true);
            }

            if (input.space.isDown && this.jumpEnabled
                // && this.sprite.body.onFloor()
                    ) {
                this.sprite.setVelocityY(-350);
                this.sprite.play('jump', true);
                this.jumpEnabled = false
            }

            if (!input.space.isDown)
                this.jumpEnabled = true
        }
        else if(GameState.getCurrentGameState() === GameState.StateJustReachedDanceFloor) {
            //going right
            if(!this.sprite.flipX && this.sprite.x < this.danceFloorPositionX) {
                this.sprite.setVelocityX(30)
                this.sprite.play('run', true);
            }
            //going left
            else if(this.sprite.flipX && this.sprite.x > this.danceFloorPositionX) {
                this.sprite.play('run', true);
                this.sprite.setVelocityX(-30)
            }
            else {
                this.sprite.setVelocityX(0)
                this.sprite.play('danceM', true);
                this.sprite.setFlipX(false)
                GameState.goToNextState()
                GameState.goToNextStateTimed(5000)
            }
        }
        else if(GameState.getCurrentGameState() === GameState.StateReboundDancing) {
            if(!this.sprite.anims.isPlaying) {
                this.sprite.play('danceM', true);
                this.sprite.setFlipX(!this.sprite.flipX)
            }
        }
        else if(GameState.getCurrentGameState() === GameState.StateHeadingToShip) {
            this.sprite.setVelocityX(70).setFlipX(false);

            this.sprite.body.onFloor() && this.sprite.play('run', true);
        
            this.scene.physics.world.bounds.setPosition(this.scene.cameras.main.worldView.x, 0);

            if(this.jumpTriggersX.includes(this.sprite.x) && this.jumpEnabled) {
                this.sprite.setVelocityY(-350);
                this.sprite.play('jump', true);
                this.jumpEnabled = false
            }
            else this.jumpEnabled = true

            if(this.sprite.x >= this.shipPositionX) {
                this.sprite.setVelocityX(0);
                GameState.goToNextState()
            }

            console.log("Mario x: ", this.sprite.x)
        }
        else if(GameState.getCurrentGameState() === GameState.StateOnShipMario) {
            this.sprite.play('idle', true);
        }
    }

    die() {
        this.sprite.isDed = true;
        this.sprite.setVelocity(0, -350);
        this.sprite.play('die', true);
        this.sprite.setCollideWorldBounds(false);
    }
}

export default Player;