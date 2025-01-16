import Ghost from "./Ghost"
import {Vector2} from "three";

export default class Blinky extends Ghost
{
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 0
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

        this.corner = new Vector2(this.game.headerSpaceX + (this.map.map[0].length - 2) * this.map.blocksize, this.game.headerSpaceY + this.map.blocksize)


    }

    findTarget()
    {
        return new Vector2(this.game.pacman.x, this.game.pacman.y)
    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_LEFT
        this.state = "chase"
        this.getStartingPosition()
    }

}