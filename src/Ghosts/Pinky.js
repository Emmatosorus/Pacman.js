import Ghost from "./Ghost"
import {Vector2} from "three";

export default class Pinky extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 1
        this.imgLine = 0

        this.direction = this.DIRECTION_UP

        this.corner = new Vector2(this.game.headerSpaceX + this.map.blocksize, this.game.headerSpaceY + this.map.blocksize)

    }

    findTarget()
    {
        let pacmanDir = this.game.inputManager.direction

        if (pacmanDir === this.DIRECTION_DOWN) {
            return new Vector2(this.pacman.x, this.pacman.y + (4 * this.map.blocksize))
        }
        else if (pacmanDir === this.DIRECTION_LEFT) {
            return new Vector2(this.pacman.x - (4 * this.map.blocksize), this.pacman.y)
        }
        else if (pacmanDir === this.DIRECTION_RIGHT) {
            return new Vector2(this.pacman.x + (4 * this.map.blocksize), this.pacman.y)
        }
        else {
            return new Vector2(this.pacman.x - (4 * this.map.blocksize), this.pacman.y - (4 * this.map.blocksize))
        }

    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_UP
        this.moveDelay = 0
        this.state = "chase"
        this.getStartingPosition()
    }

}