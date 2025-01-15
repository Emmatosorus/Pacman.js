import * as THREE from "three"
import Ghost from "./Ghost"

export default class Clyde extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 3
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

        this.corner = [this.map.blocksize, (this.map.map.length - 2) * this.map.blocksize]

    }

    findTarget()
    {
        let pacmanPos = new THREE.Vector2(this.pacman.x, this.pacman.y)
        let clydePos = new THREE.Vector2(this.x, this.y)

        let distance = clydePos.distanceTo(pacmanPos)

        if (distance > 8 * this.map.blocksize) {
            return pacmanPos
        }
        else {
            return new THREE.Vector2(this.corner.x, this.corner.y)
        }
    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_LEFT
        this.getPosition()
    }
}