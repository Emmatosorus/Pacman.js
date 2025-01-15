import * as THREE from "three"
import Ghost from "./Ghost"

export default class Inky extends Ghost {
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 2
        this.imgLine = 0

        this.direction = this.DIRECTION_RIGHT

    }

    findTarget()
    {
        return "hey"
    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_RIGHT
        this.getPosition()
    }

}