import * as THREE from "three"
import Ghost from "./Ghost"

export default class Blinky extends Ghost
{
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 0
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

    }

    findTarget()
    {
        return new THREE.Vector2(this.game.pacman.x, this.game.pacman.y)
    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_LEFT
        this.getStartingPosition()
    }

}