import Ghost from "./Ghost"

export default class Blinky extends Ghost
{
    constructor(mapCode)
    {
        super(mapCode)

        this.imgColumn = 0
        this.imgLine = 0

    }

}