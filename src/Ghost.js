import Game from './Game'

export default class Ghost
{
    constructor()
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

        this.x = 0
        this.y = 0
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