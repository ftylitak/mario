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

        this.reachedRebound = false
        this.danceFloorPositionX = 2400
        this.justReachedDanceFloor = true

        return this;
    }

    setReachedRebound() {
        console.log("player reached rebound: ", this)
        this.reachedRebound = true
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.sprite, gameObject);

        return this;
    }

    update(input) {
        if(this.reachedRebound) {
            if(this.justReachedDanceFloor) {
                    //going right
                if(!this.sprite.flipX && this.sprite.x < 2400) {
                    this.sprite.setVelocityX(30)
                    this.sprite.play('run', true);
                }
                //going left
                else if(this.sprite.flipX && this.sprite.x > 2400) {
                    this.sprite.play('run', true);
                    this.sprite.setVelocityX(-30)
                }
                else {
                    this.sprite.setVelocityX(0)
                    this.sprite.play('danceM', true);
                    this.sprite.setFlipX(false)
                    this.justReachedDanceFloor = false
                }
            }
            else {
                if(!this.sprite.anims.isPlaying) {
                    this.sprite.play('danceM', true);
                    this.sprite.setFlipX(!this.sprite.flipX)
                }
            }
           
            return 
        }
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

    die() {
        this.sprite.isDed = true;
        this.sprite.setVelocity(0, -350);
        this.sprite.play('die', true);
        this.sprite.setCollideWorldBounds(false);
    }
}

export default Player;