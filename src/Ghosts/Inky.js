import * as THREE from "three"
import Ghost from "./Ghost"

export default class Inky extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 2
        this.imgLine = 0

        this.direction = this.DIRECTION_RIGHT
        this.dotLimit = 21

        this.inHouse = true

    }

    findTarget()
    {
        let pacmanDir = this.game.inputManager.direction

        let blinkyPos = new THREE.Vector2(this.game.ghosts[0].x, this.game.ghosts[0].y)
        let targetPos

        if (pacmanDir === this.DIRECTION_DOWN) {
            targetPos = new THREE.Vector2(this.pacman.x, this.pacman.y + (2 * this.map.blocksize))
        }
        else if (pacmanDir === this.DIRECTION_LEFT) {
            targetPos = new THREE.Vector2(this.pacman.x - (2 * this.map.blocksize), this.pacman.y)
        }
        else if (pacmanDir === this.DIRECTION_RIGHT) {
            targetPos = new THREE.Vector2(this.pacman.x + (2 * this.map.blocksize), this.pacman.y)
        }
        else {
            targetPos = new THREE.Vector2(this.pacman.x - (2 * this.map.blocksize), this.pacman.y - (2 * this.map.blocksize))
        }

        blinkyPos.rotateAround(targetPos, Math.PI)

        return blinkyPos
    }

    reset() {
        this.possibleDirections = []
        this.inHouse = true
        this.dotCounter = 0
        this.leaveHouseDelay = 0
        this.direction = this.DIRECTION_RIGHT
        this.getStartingPosition()
    }

}