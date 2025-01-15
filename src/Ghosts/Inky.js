import Ghost from "./Ghost"

export default class Inky extends Ghost
{
    constructor(mapCode)
    {
        super(mapCode)

        this.imgColumn = 2
        this.imgLine = 0

        this.direction = this.DIRECTION_RIGHT

    }

    reset()
    {
        this.direction = this.DIRECTION_RIGHT
        this.getPosition()
    }

}