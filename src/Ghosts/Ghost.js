import * as THREE from "three"
import Game from '../Game'
import { compArray } from "../Utils/Utils"

export default class Ghost {
    constructor(mapCode) {
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

        this.state = "chase"

        this.width = 32
        this.height = 32
        this.mapCode = mapCode

        this.x = 0
        this.y = 0

        this.speed = 4
        this.speedDelay = 20
        this.moveDelay = 0



        this.getPosition()

        this.possibleDirections = []
        this.checkMoves()

    }

    getPosition() {
        for (let i = 0; i < this.map.map.length; i++) {
            for (let j = 0; j < this.map.map[0].length; j++) {
                if (this.map.map[i][j] === this.mapCode) {
                    this.x = (j * this.map.blocksize)
                    this.y = (i * this.map.blocksize)
                    return
                }
            }
        }
    }

    checkMoves() {
        let newMoves = []

        if (this.direction !== this.DIRECTION_UP && this.canMove(this.DIRECTION_DOWN)) {
            newMoves.push(this.DIRECTION_DOWN)
        }
        if (this.direction !== this.DIRECTION_LEFT && this.canMove(this.DIRECTION_RIGHT)) {
            newMoves.push(this.DIRECTION_RIGHT)
        }
        if (this.direction !== this.DIRECTION_DOWN && this.canMove(this.DIRECTION_UP) && this.forbiddenUp() === false) {
            newMoves.push(this.DIRECTION_UP)
        }
        if (this.direction !== this.DIRECTION_RIGHT && this.canMove(this.DIRECTION_LEFT)) {
            newMoves.push(this.DIRECTION_LEFT)
        }
        if (newMoves.length !== 0 && compArray(newMoves, this.possibleDirections) === false) {
            this.possibleDirections = newMoves
            return "newMoves"
        }
        return "noNewMoves"
    }

    ghostHouse() {
        let newMove = null

        let x = Math.floor((this.x + this.map.blocksize * 0.5) / this.map.blocksize)
        let y = Math.floor((this.y + this.map.blocksize * 0.5) / this.map.blocksize)

        for (let i = 0; i < this.map.ghostHouse.length; i++) {
            if (compArray(this.map.ghostHouse[i], [y, x]) === true) {
                if ((y === 10 || y === 9) && x === 10 && this.canMove(this.DIRECTION_UP)) {
                    newMove = this.DIRECTION_UP
                }
                else if (y === 10 && x === 9 && this.canMove(this.DIRECTION_RIGHT)) {
                    newMove = this.DIRECTION_RIGHT
                }
                else if (y === 10 && x === 11 && this.canMove(this.DIRECTION_LEFT)) {
                    newMove = this.DIRECTION_LEFT
                }
                else {
                    newMove = this.direction
                }
                return newMove
            }
        }
        return newMove
    }

    canMove(dir) {
        let smallX
        let smallY
        let bigX
        let bigY

        if (dir === this.DIRECTION_UP) {
            smallX = Math.floor((this.x + 1) / this.map.blocksize)
            bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
            smallY = Math.ceil(this.y / this.map.blocksize) - 1

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[smallY][bigX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_DOWN) {
            smallX = Math.floor((this.x + 1) / this.map.blocksize)
            bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
            smallY = Math.floor(this.y / this.map.blocksize) + 1

            if (this.map.map[Math.floor((this.y + this.map.blocksize * 0.5) / this.map.blocksize)]
                [Math.floor((this.x + this.map.blocksize * 0.5) / this.map.blocksize)] === this.map.BLINKY) {
                return false
            }

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[smallY][bigX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_LEFT) {
            smallX = Math.ceil(this.x / this.map.blocksize) - 1
            smallY = Math.floor((this.y + 1) / this.map.blocksize)
            bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[bigY][smallX] === this.map.WALL);

        }
        if (dir === this.DIRECTION_RIGHT) {
            smallX = Math.floor(this.x / this.map.blocksize) + 1
            smallY = Math.floor((this.y + 1) / this.map.blocksize)
            bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

            return !(this.map.map[smallY][smallX] === this.map.WALL || this.map.map[bigY][smallX] === this.map.WALL);
        }
    }

    forbiddenUp() {
        let x = Math.floor((this.x + this.map.blocksize * 0.5) / this.map.blocksize)
        let y = Math.floor((this.y + this.map.blocksize * 0.5) / this.map.blocksize)

        for (let i = 0; i < this.map.upForbidden.length; i++) {
            if (compArray(this.map.upForbidden[i], [y, x]) === true) {
                return true
            }
        }
        return false
    }

    slowZone() {
        let x

        if (this.direction === this.DIRECTION_LEFT) {
            x = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
        }
        else {
            x = Math.floor((this.x + this.map.blocksize * 0.5) / this.map.blocksize)
        }

        let y = Math.floor((this.y + this.map.blocksize * 0.5) / this.map.blocksize)

        for (let i = 0; i < this.map.slowZone.length; i++) {
            if (compArray(this.map.slowZone[i], [y, x]) === true) {
                return true
            }
        }
        return false
    }

    findTarget()
    {

    }

    target()
    {

        let targetPos = this.findTarget()
        let ghostPos = new THREE.Vector2()
        let distance = 2000
        let tmp = 0

        for (let i = 0; i < this.possibleDirections.length; i++) {
            if (this.possibleDirections[i] === this.DIRECTION_UP) {
                ghostPos.set(this.x, this.y - this.speed)
                tmp = ghostPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_UP
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_DOWN) {
                ghostPos.set(this.x, this.y + this.speed)
                tmp = ghostPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_DOWN
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_LEFT) {
                ghostPos.set(this.x - this.speed, this.y)
                tmp = ghostPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_LEFT
                }
            }
            if (this.possibleDirections[i] === this.DIRECTION_RIGHT) {
                ghostPos.set(this.x + this.speed, this.y)
                tmp = ghostPos.distanceTo(targetPos)
                if (tmp < distance) {
                    distance = tmp
                    this.direction = this.DIRECTION_RIGHT
                }
            }
        }

        return this.direction
    }

    chooseDirection() {

        let newMove = this.ghostHouse()
        if (newMove !== null) {
            this.direction = newMove
        }
        else if (this.checkMoves() === "newMoves") {
            this.target()
        }
    }

    move() {
        this.moveDelay += this.game.time.deltaTime
        if (this.moveDelay < this.speedDelay) {
            return
        }
        this.moveDelay = 0

        this.chooseDirection()

        let speed = this.speed
        if (this.slowZone() === true) {
            speed *= 0.5
        }

        if (this.direction === this.DIRECTION_UP && this.canMove(this.DIRECTION_UP)) {
            this.y -= speed
        }
        if (this.direction === this.DIRECTION_DOWN && this.canMove(this.DIRECTION_DOWN)) {
            this.y += speed
        }
        if (this.direction === this.DIRECTION_LEFT && this.canMove(this.DIRECTION_LEFT)) {
            this.x -= speed
        }
        if (this.direction === this.DIRECTION_RIGHT && this.canMove(this.DIRECTION_RIGHT)) {
            this.x += speed
        }
        if (this.x < 0) {
            this.x = (this.map.map[0].length - 1) * this.map.blocksize
        }
        else if (this.x > (this.map.map[0].length - 1) * this.map.blocksize) {
            this.x = 0
        }

    }

    draw() {
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

    update() {
        if (this.game.state === "playing") {
            this.move()
        }
        this.draw()
    }

    cleanup() {
        for (const key of Object.keys(this)) {
            this[key] = null
        }
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

            Inky + Clyde : To leave ghost house target Blinky spawn position
            For leaving the ghost house go to "Home Sweet Home" :
                https://www.gamedeveloper.com/design/the-pac-man-dossier

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
                Pacman left : Target 4 tiles to the left of Pacman
                Pacman right : Target 4 tiles to the right of Pacman
                Pacman down : Target 4 tiles below Pacman
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

/*
    CHATGPT SUMMARY OF GHOST HOUSE MECHANICS

### 1. **Ghost House Basics:**
   - The ghost house is in the center of the maze and is the starting point for all the ghosts.
   - After each level is completed or Pac-Man loses a life, the ghosts return to the ghost house, and they must leave to start chasing Pac-Man again.

### 2. **Blinky’s Behavior:**
   - Blinky is always positioned outside the ghost house after a level or when Pac-Man dies.
   - The only way Blinky returns to the ghost house is if Pac-Man captures him, after which he turns around and leaves the house immediately.

### 3. **The Dot Counters:**
   - **Pinky, Inky, and Clyde** have "dot counters" that track how many dots Pac-Man has eaten. This determines when they leave the ghost house.
   - These counters start at zero and can only be active when the ghosts are inside the house. However, only one ghost's dot counter can be active at any time.

### 4. **Order of Dot Counters:**
   - The ghosts have a priority order for which one gets to count dots first: **Pinky**, then **Inky**, then **Clyde**.
   - Each ghost has a "dot limit" which tells them when to leave. For example:
     - **Pinky** leaves immediately (dot limit = 0).
     - **Inky** needs 30 dots before leaving on the first level.
     - **Clyde** needs 60 dots before leaving on the first level.

### 5. **Dot Limit Changes:**
   - On **level 2**, Inky’s limit changes to 0 (so he leaves immediately, like Pinky), and Clyde's limit changes to 50.
   - From **level 3** onward, all ghosts have a dot limit of 0 and leave the ghost house as soon as a new level starts.

### 6. **What Happens When Pac-Man Dies:**
   - When Pac-Man loses a life, the game switches to a **global dot counter**, which tracks dots Pac-Man eats after losing a life. This replaces the individual dot counters.
   - **Pinky** will leave when the global counter reaches 7, **Inky** when it reaches 17, and **Clyde** when it hits 32.
   - If **Clyde** is still inside when the global counter hits 32, the counter is reset to 0, and the normal dot counters are re-enabled.

### 7. **Timer Control:**
   - There’s also a **timer** that tracks how long Pac-Man goes without eating a dot. This timer forces ghosts to leave the house if it runs out of time.
   - This timer starts at 4 seconds but shortens to 3 seconds from **level 5** onwards.
   - The timer is used to ensure the ghosts leave even if Pac-Man isn’t eating many dots. If Pac-Man avoids eating for too long, the most-preferred ghost (based on the priority order: Pinky, Inky, then Clyde) will be forced to leave.

### 8. **How to Trap Ghosts in the House:**
   - There’s a way to keep the ghosts inside the house longer by manipulating the system with the dot counters and timer. Specifically:
     - If you eat dots slowly after losing a life, you can trick the game into keeping the ghosts inside the house by ensuring the global counter never reaches 32 before Clyde exits.
     - Once Clyde exits, you can make sure the ghosts stay inside by carefully managing the timing of your dot consumption.

### 9. **Movement Direction After Exiting:**
   - Ghosts usually move **left** after exiting the ghost house.
   - However, if the system changes modes while a ghost is inside, that ghost may move **right** instead when it leaves.

### Summary:
- The ghosts' behavior in *Pac-Man* revolves around their dot counters and how the game switches between individual and global counters when Pac-Man dies.
- The ghosts’ release from the house is controlled by both these counters and a timer that forces them out if Pac-Man avoids eating dots for too long.
- By managing these systems, you can manipulate how long the ghosts stay in the house or even trap them for longer periods.

 */