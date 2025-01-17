import Ghost from "./Ghost"
import {Vector2} from "three";

export default class Inky extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 2
        this.imgLine = 0

        this.direction = this.DIRECTION_RIGHT
        this.dotLimit = 21

        this.inHouse = true

        this.corner = new Vector2(this.game.headerSpaceX + (this.map.map[0].length - 2) * this.map.blocksize, this.game.headerSpaceY + (this.map.map.length - 2) * this.map.blocksize)

    }

    findTarget()
    {
        let pacmanDir = this.game.inputManager.direction

        let blinkyPos = new Vector2(this.game.ghosts[0].x, this.game.ghosts[0].y)
        let targetPos

        if (pacmanDir === this.DIRECTION_DOWN) {
            targetPos = new Vector2(this.pacman.x, this.pacman.y + (2 * this.map.blocksize))
        }
        else if (pacmanDir === this.DIRECTION_LEFT) {
            targetPos = new Vector2(this.pacman.x - (2 * this.map.blocksize), this.pacman.y)
        }
        else if (pacmanDir === this.DIRECTION_RIGHT) {
            targetPos = new Vector2(this.pacman.x + (2 * this.map.blocksize), this.pacman.y)
        }
        else {
            targetPos = new Vector2(this.pacman.x - (2 * this.map.blocksize), this.pacman.y - (2 * this.map.blocksize))
        }

        blinkyPos.rotateAround(targetPos, Math.PI)

        return blinkyPos
    }

    reset() {
        this.possibleDirections = []
        this.inHouse = true
        this.dotCounter = 0
        this.leaveHouseDelay = 0
        this.moveDelay = 0
        this.direction = this.DIRECTION_RIGHT
        this.state = "chase"
        this.getStartingPosition()
    }

}