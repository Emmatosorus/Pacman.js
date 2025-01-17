import Ghost from "./Ghost"
import {Vector2} from "three";

export default class Clyde extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 3
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

        this.dotLimit = 42

        this.inHouse = true

        this.corner = new Vector2(this.game.headerSpaceX + this.map.blocksize, this.game.headerSpaceY + (this.map.map.length - 2) * this.map.blocksize)
    }

    findTarget()
    {
        console.log(this.x, this.y)
        let pacmanPos = new Vector2(this.pacman.x, this.pacman.y)
        let clydePos = new Vector2(this.x, this.y)

        let distance = clydePos.distanceTo(pacmanPos)

        if (distance > 8 * this.map.blocksize) {
            return pacmanPos
        }
        else {
            return new Vector2(this.corner.x, this.corner.y)
        }
    }

    reset() {
        this.possibleDirections = []
        this.inHouse = true
        this.dotCounter = 0
        this.leaveHouseDelay = 0
        this.moveDelay = 0
        this.direction = this.DIRECTION_LEFT
        this.state = "chase"
        this.getStartingPosition()
    }
}