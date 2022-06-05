import GameState from '../gameObjects/GameState'

class Trigger {
    constructor(scene) {
        this.scene = scene;
        // Or you can simply say staticGroup, to make them immovable an not affected by gravity
        this.triggers = this.scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // You could also use the same object layer and differentiate between different objects by custom properties
        const triggerObjects = this.scene.map.getObjectLayer('reboundTrigger').objects;
        
        for (const trigger of triggerObjects) {
            const flagCoordinates = this.scene.tileset.texCoordinates[trigger.gid-1]; // 962 is the tile index in tiled for the flag

            this.scene = scene;
            const sprt = this.scene.add.tileSprite(trigger.x, trigger.y-16, 16, 16, 'tiles')
                .setOrigin(0, 0)
                .setTilePosition(flagCoordinates.x, flagCoordinates.y);
            sprt.texture.setFilter(undefined)

            this.triggers.add(sprt)
        }
        this.triggered = false
    }

    collideWith(gameObject) {
        this.scene.physics.add.overlap(this.triggers, gameObject, this.collect, null, this);

        return this;
    }

    update() {
    }

    collect() {
        if(!this.triggered) {
            this.triggered = true
            GameState.goToNextState()
        }
    }
}

export default Trigger;