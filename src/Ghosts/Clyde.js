import Ghost from "./Ghost"

export default class Clyde extends Ghost
{
    constructor(mapCode)
    {
        super(mapCode)

        this.imgColumn = 3
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

    }

    reset()
    {
        this.direction = this.DIRECTION_LEFT
        this.getPosition()
    }
}