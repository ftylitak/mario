
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
        const coinBarObjects = this.scene.map.getObjectLayer('coin-bar').objects;
        
        for (const coin of coinObjects) {
            console.log("Coin: ", coin)
            const flagCoordinates = this.scene.tileset.texCoordinates[coin.gid-1]; // 962 is the tile index in tiled for the flag

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(coin.x, coin.y-16, 16, 16, 'tiles')
                .setOrigin(0, 0)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y);
            sprt.texture.setFilter(undefined)

            this.coins.add(sprt)
        }

        console.log("this.scene.barItemTileset: ", this.scene.barItemTileset)
        const gidOffset = 5213

        for (const coin of coinBarObjects) {
            const flagCoordinates = this.scene.barItemTileset.texCoordinates[coin.gid-gidOffset]; // 962 is the tile index in tiled for the flag
            console.log("Coin-bar-item: ", coin, ", tile: ", flagCoordinates, ", id: ", coin.gid-gidOffset)

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(coin.x, coin.y-16, 16, 16, 'bar-items')
                .setOrigin(0, 0)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y);
            sprt.texture.setFilter(undefined)

            this.coins.add(sprt)
        }
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