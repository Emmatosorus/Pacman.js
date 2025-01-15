import * as THREE from "three"
import Ghost from "./Ghost"

export default class Pinky extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 1
        this.imgLine = 0

        this.direction = this.DIRECTION_UP


    }

    findTarget()
    {
        let pacmanDir = this.game.InputManager.direction

        if (pacmanDir === this.DIRECTION_DOWN) {
            return new THREE.Vector2(this.pacman.x, this.pacman.y + (4 * this.map.blocksize))
        }
        else if (pacmanDir === this.DIRECTION_LEFT) {
            return new THREE.Vector2(this.pacman.x - (4 * this.map.blocksize), this.pacman.y)
        }
        else if (pacmanDir === this.DIRECTION_RIGHT) {
            return new THREE.Vector2(this.pacman.x + (4 * this.map.blocksize), this.pacman.y)
        }
        else {
            return new THREE.Vector2(this.pacman.x - (4 * this.map.blocksize), this.pacman.y - (4 * this.map.blocksize))
        }

    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_UP
        this.getPosition()
    }

}