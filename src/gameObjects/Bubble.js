import GameState from '../gameObjects/GameState'

class Bubble {
    constructor(scene) {
        this.scene = scene;
        // Or you can simply say staticGroup, to make them immovable an not affected by gravity
        this.sprites = this.scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // You could also use the same object layer and differentiate between different objects by custom properties
        const bubble = this.scene.map.getObjectLayer('wherIsThePrincessBubble').objects;
        const content = this.scene.map.getObjectLayer('whereIsThePricess').objects;
        
        for (const item of bubble) {
            const flagCoordinates = this.scene.tileset.texCoordinates[item.gid-1];

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(item.x, item.y-16, 16, 16, 'tiles')
                .setOrigin(0, 0)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y)
                .setVisible(false)
            if(item.gid === 5115) {
                this.smallBubble = []
                this.smallBubble.push(sprt)
            }
            else if(item.gid === 5185) {
                if(!this.mediumBubble)
                    this.mediumBubble = []

                this.mediumBubble.push(sprt)
            }
            else {
                if(!this.bigBubble)
                    this.bigBubble = []
                this.bigBubble.push(sprt)
            }

            sprt.texture.setFilter(undefined)

            this.sprites.add(sprt)
        }

        for (const item of content) {
            const flagCoordinates =this.scene.tileset.texCoordinates[item.gid-1];

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(item.x, item.y-16, 16, 16, 'tiles')
                .setOrigin(0, 0)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y)
                .setVisible(false)
            sprt.texture.setFilter(undefined)

            if(item.gid === 5114) {
                this.mark = [sprt]
            }
            else {
                if(!this.graphic) 
                    this.graphic = []
                this.graphic.push(sprt)
            }

            this.sprites.add(sprt)
        }
    }

    startAnimation() {
        // this.scene.physics.add.overlap(this.sprites, gameObject, this.collect, null, this);

        // return this;
        this.showBubble()


        setTimeout(()=> {
            this.animationStarted = false
            this.sprites.children.each(sprt => {
                sprt.setVisible(false)
            }, this)

            GameState.goToNextState()
        }, 6000)
        this.animationStarted = true
    }

    showBubble() {
        setTimeout(()=> {
            this.smallBubble.forEach(tile => {
                tile.setVisible(true)
            })
        }, 500)
        setTimeout(()=> {
            this.mediumBubble.forEach(tile => {
                tile.setVisible(true)
            })
        }, 850)

        setTimeout(()=> {
            this.bigBubble.forEach(tile => {
                tile.setVisible(true)
            })
        }, 1200)
        setTimeout(()=> {
            this.graphic.forEach(tile => {
                tile.setVisible(true)
            })
            this.repeatedTimer = setInterval(() => {
                if(this.animationStarted) {
                    this.mark.forEach(tile => {
                        tile.setVisible(!tile.visible)
                    })
                }
                else 
                    clearInterval(this.repeatedTimer)
            },500)
        }, 1600)
    }

    update() {
        // for (const coin of this.sprites.children.entries) {
        //     coin.play('rotate', true);
        // }
    }

    collect() {
        // for (const coin of this.sprites.children.entries) {
        //     if (!coin.body.touching.none) {
        //         coin.body.setEnable(false);

        //         this.scene.tweens.add({
        //             targets: coin,
        //             ease: 'Power1',
        //             scaleX: 0,
        //             scaleY: 0,
        //             duration: 200,
        //             onComplete: () => coin.destroy()
        //         });
        //     }
        // }
        
        // increaseScore(1);
    }
}

export default Bubble;