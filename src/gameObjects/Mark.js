class Mark {
    constructor(scene, initialX) {
        this.scene = scene;

        // Or you can simply say staticGroup, to make them immovable an not affected by gravity
        this.marks = this.scene.physics.add.group(
            {
         //   immovable: false,
            allowGravity: false
        }
        );

        const flagCoordinates = this.scene.tileset.texCoordinates[5121]; // 962 is the tile index in tiled for the flag
        this.scene = scene;
        const sprt = this.scene.add.tileSprite(initialX, 410-16, 16, 16, 'tiles')
            .setOrigin(0, 0)
            .setTilePosition(flagCoordinates.x, flagCoordinates.y);
        sprt.texture.setFilter(undefined)

        this.sprt = sprt
        this.marks.add(sprt)
        // this.marks.add(sprt)

        // const sprt2 = this.scene.add.tileSprite(2456, 410-16, 16, 16, 'tiles')
        //     .setOrigin(0, 0)
        //     .setTilePosition(flagCoordinates.x, flagCoordinates.y);
        // sprt.texture.setFilter(undefined)

        // this.marks.add(sprt2)

        this.tickCount = Math.floor(Math.random(100) *100)
        this.markGoesRight = this.tickCount > 50

        console.log("mark sprit: ", this.sprt)
    }

    getTicks() {
        return this.tickCount
    }

    collideWith(gameObject) {
        this.collider = this.scene.physics.add.collider(this.mark, gameObject);

        return this;
    }

    update() {
        this.tickCount++
    }

    gameOver() {
        // // PHEW
        // if (this.scene.player.sprite.body.touching.down) {
        //     this.die();

        //     return;
        // }

        // this.scene.player.die();
        // this.scene.input.keyboard.shutdown();

        // this.scene.physics.world.removeCollider(this.scene.player.collider);
        // this.scene.physics.world.removeCollider(this.collider);

        // setTimeout(() => {
        //     this.scene.scene.start('GameOver');
        // }, 1500);
    }

    // die() {
    //     for (const goomba of this.goombas.children.entries) {
    //         if (goomba.body.touching.up) {
    //             goomba.isDed = true;
    //             goomba.play('goombaDie', true);
    //             goomba.on('animationcomplete', () => goomba.destroy());

    //             increaseScore(.5);

    //             this.scene.player.sprite.setVelocity(0, -350);
    //             this.scene.player.sprite.play('jump');
    //         };
    //     }
    // }
}

export default Mark;
