import * as THREE from "three"
import Ghost from "./Ghost"

export default class Clyde extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 3
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

    }

    findTarget()
    {
        return "hey"
    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_LEFT
        this.getPosition()
    }
}