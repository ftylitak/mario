
import increaseScore from '../ui/increaseScore'

class Coin {
    constructor(scene) {
        this.scene = scene;
        // Or you can simply say staticGroup, to make them immovable an not affected by gravity
        this.coins = this.scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // You could also use the same object layer and differentiate between different objects by custom properties
        const coinObjects = this.scene.map.getObjectLayer('coin').objects;
        
        for (const coin of coinObjects) {
            console.log(coin)
            const flagCoordinates = this.scene.tileset.texCoordinates[coin.gid-1]; // 962 is the tile index in tiled for the flag

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(coin.x, coin.y-16, 16, 16, 'tiles')
                .setOrigin(0, 0)
               // .setScale(1.5)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y);
            sprt.texture.setFilter(undefined)

            this.coins.add(sprt)

            //this.scene.map.createFromTiles(coin.gid, null, {key: 'tiles'}, this.scene)
            // this.coins.create(coin.x, coin.y)
            //     .setOrigin(0)
            //     .setDepth(-1);
        }

        // --- Or ---
        // const coinSprites = this.scene.map.createFromObjects('coin');

        // for (const coin of coinSprites) {
        //     console.log(coin)
        //     // coin.setTexture('atlas')
        //     //     .setScale(1) // setTexture resets the scale to .5 so this is needed
        //     //     .setOrigin(0)
        //     //     .setDepth(-1);
            
        //     this.coins.add(coin);
        // }
    }

    collideWith(gameObject) {
        this.scene.physics.add.overlap(this.coins, gameObject, this.collect, null, this);

        return this;
    }

    update() {
        // for (const coin of this.coins.children.entries) {
        //     coin.play('rotate', true);
        // }
    }

    collect() {
        for (const coin of this.coins.children.entries) {
            if (!coin.body.touching.none) {
                coin.body.setEnable(false);

                this.scene.tweens.add({
                    targets: coin,
                    ease: 'Power1',
                    scaleX: 0,
                    scaleY: 0,
                    duration: 200,
                    onComplete: () => coin.destroy()
                });
            }
        }
        
        increaseScore(1);
    }
}

export default Coin;