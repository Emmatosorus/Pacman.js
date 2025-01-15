import * as THREE from "three"
import Ghost from "./Ghost"

export default class Blinky extends Ghost
{
    constructor(mapCode) {
        super(mapCode)

        this.imgColumn = 0
        this.imgLine = 0

        this.direction = this.DIRECTION_LEFT

    }

    target()
    {
        let targetPos = new THREE.Vector2(this.game.pacman.x, this.game.pacman.y)
        let blinkyPos = new THREE.Vector2()
        let distance = 2000
        let tmp = 0

        console.log(this.possibleDirections[0])

        for (let i = 0; i < this.possibleDirections.length; i++) {
            if (this.possibleDirections[i] === this.DIRECTION_UP) {
                blinkyPos.set(this.x, this.y - this.speed)
                tmp = blinkyPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_UP
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_DOWN) {
                blinkyPos.set(this.x, this.y + this.speed)
                tmp = blinkyPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_DOWN
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_LEFT) {
                blinkyPos.set(this.x - this.speed, this.y)
                tmp = blinkyPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_LEFT
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_RIGHT) {
                blinkyPos.set(this.x + this.speed, this.y)
                tmp = blinkyPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_RIGHT
                }
            }
        }

        return this.direction


    }

    reset() {
        this.possibleDirections = []
        this.direction = this.DIRECTION_LEFT
        this.getPosition()
    }

}