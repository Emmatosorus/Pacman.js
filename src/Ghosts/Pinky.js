import Ghost from "./Ghost"

export default class Pinky extends Ghost
{
    constructor(mapCode)
    {
        super(mapCode)

        this.imgColumn = 1
        this.imgLine = 0

        this.direction = this.DIRECTION_UP


    }

    reset()
    {
        this.possibleDirections = []
        this.direction = this.DIRECTION_UP
        this.getPosition()
    }

}