import Game from '../Game'
import { compArray } from "../Utils/Utils"

export default class Ghost
{
    constructor(mapCode)
    {
        this.game = new Game()
        this.sizes = this.game.sizes
        this.time = this.game.time
        this.map = this.game.map
        this.sprites = this.game.sprites
        this.pacman = this.game.pacman

        this.img = this.sprites.img[3]
        this.imgLine = 0
        this.imgColumn = 0

        this.DIRECTION_RIGHT = 0
        this.DIRECTION_DOWN = 1
        this.DIRECTION_LEFT = 2
        this.DIRECTION_UP = 3
        this.DIRECTION_NONE = 4
        this.direction = this.DIRECTION_NONE

        this.width = 32
        this.height = 32
        this.mapCode = mapCode

        this.x = 0
        this.y = 0

        this.speed = 2

        this.getPosition()
        this.lastPosition = [this.x, this.y]

        this.possibleDirections = []
        this.checkMoves()

    }

    getPosition()
    {
        for (let i = 0; i < this.map.map.length; i++)
        {
            for (let j = 0; j < this.map.map[0].length; j++)
            {
                if (this.map.map[i][j] === this.mapCode)
                {
                    this.x = (j * this.map.blocksize)
                    this.y = (i * this.map.blocksize)
                    return
                }
            }
        }
    }

    checkMoves()
    {
        let newMoves = []

        if (this.direction !== this.DIRECTION_UP && this.canMove(this.DIRECTION_DOWN))
        {
            newMoves.push(this.DIRECTION_DOWN)
        }
        if (this.direction !== this.DIRECTION_LEFT && this.canMove(this.DIRECTION_RIGHT))
        {
            newMoves.push(this.DIRECTION_RIGHT)
        }
        if (this.direction !== this.DIRECTION_DOWN && this.canMove(this.DIRECTION_UP))
        {
            newMoves.push(this.DIRECTION_UP)
        }
        if (this.direction !== this.DIRECTION_RIGHT && this.canMove(this.DIRECTION_LEFT))
        {
            newMoves.push(this.DIRECTION_LEFT)
        }
        if (newMoves.length !== 0 && compArray(newMoves, this.possibleDirections) === false)
        {
            this.possibleDirections = newMoves
            return "newMoves"
        }
        return "noNewMoves"
    }

    canMove(dir)
    {
        let smallX
        let smallY
        let bigX
        let bigY

        if (dir === this.DIRECTION_UP)
        {
            smallX = Math.floor((this.x + 1) / this.map.blocksize)
            bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
            smallY = Math.ceil(this.y / this.map.blocksize) - 1

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[smallY][bigX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_DOWN)
        {
            smallX = Math.floor((this.x + 1) / this.map.blocksize)
            bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
            smallY = Math.floor(this.y / this.map.blocksize) + 1

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[smallY][bigX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_LEFT)
        {
            smallX = Math.ceil(this.x / this.map.blocksize) - 1
            smallY = Math.floor((this.y + 1) / this.map.blocksize)
            bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[bigY][smallX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_RIGHT)
        {
            smallX = Math.floor(this.x / this.map.blocksize) + 1
            smallY = Math.floor((this.y + 1) / this.map.blocksize)
            bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[bigY][smallX] === this.map.WALL);
        }
    }

    move()
    {
        if (this.checkMoves() === "newMoves")
        {
            this.lastPosition = [this.x, this.y]
            this.direction = this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)]
        }
        if (this.direction === this.DIRECTION_UP && this.canMove(this.DIRECTION_UP))
        {
            this.y -= this.speed
        }
        if (this.direction === this.DIRECTION_DOWN && this.canMove(this.DIRECTION_DOWN))
        {
            this.y += this.speed
        }
        if (this.direction === this.DIRECTION_LEFT && this.canMove(this.DIRECTION_LEFT))
        {
            this.x -= this.speed
        }
        if (this.direction === this.DIRECTION_RIGHT && this.canMove(this.DIRECTION_RIGHT))
        {
            this.x += this.speed
        }
        if (this.x < 0)
            this.x = (this.map.map[0].length - 1) * this.map.blocksize
        else if (this.x > (this.map.map[0].length - 1) * this.map.blocksize)
            this.x = 0
    }

    draw()
    {
        this.game.canvasContext.drawImage(
            this.img,
            this.imgColumn * this.map.blocksize,
            this.imgLine * this.map.blocksize,
            this.map.blocksize,
            this.map.blocksize,
            this.x + this.game.headerSpaceX,
            this.y + this.game.headerSpaceY,
            this.width,
            this.height
        )
    }

    update()
    {
        if (this.game.state === "playing")
            this.move()
        this.draw()
    }
}

/*
Ghost minds

    4 States :
        Targeting :
            Ghost on new tile and new direction available,
            Remove impossible directions and reverse direction,
            Calculate distance to target (x^2 + y^2),
            if distance is the same, take order of priority (up, left, down, right),
            if distance is different, take the shortest distance

            GHOST CANNOT GO UP IF
                1. they are right above the ghost house
                2. they are at pacman spawn
            (3 tiles wide perimeters)

        Scatter :
            if in chase or frightened turn around
            Target corners of the map
                Blinky : Top right
                Pinky : Top left
                Inky : Bottom right
                Clyde : Bottom left

        Chase :
            if in scatter or frightened turn around
            Blinky : Target pacman

            Pinky :
                Pacman left : Target 4 tiles to the left of pacman
                Pacman right : Target 4 tiles to the right of pacman
                Pacman down : Target 4 tiles below pacman
                Pacman up : Target 4 tiles above and 4 tiles to the left

            Inky :
                Target 2 tiles in front of pacman (if pacman up : 2up + 2left)
                and vector from blinky to target is turned 180 degrees on the target point
                end of the vector is the target

            Clyde : Target pacman if distance is greater than 8 tiles, else target scatter


        Frightened :
            Pacman has eaten a power pellet and HASN'T touched this ghost
            Turn around then choose random inputs (except for turn around)

        Eaten :
            Pacman has eaten a power pellet and HAS touched this ghost
            Target ghost house
*/