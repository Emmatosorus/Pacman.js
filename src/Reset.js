import Game from "./Game.js"

export default class Reset {
    constructor() {
        this.game = new Game()
        this.pacman = this.game.pacman
        this.ghosts = this.game.ghosts
        this.map = this.game.map
        this.inputManager = this.game.inputManager
        this.canvas = this.game.canvas
        this.canvasContext = this.game.canvasContext
    }

    universalReset() {
        this.canvasContext.clearRect(0,
            0,
            this.canvas.width,
            this.canvas.height
        )
        this.game.state = "pause"

        this.game.ghostCurrentBlink = 1

        this.map.dotsCollected = 0
        this.map.numberFruitCollected = 0
        this.map.fruitCollected = true
        this.map.currentFruit = 0
        this.map.wallColor = "#342DCA"

        this.pacman.currentFrame = 0;
        this.pacman.currentImage = 0;
        this.pacman.nbGhostsEaten = 0
        this.pacman.dieAnimationStart = null
        this.pacman.dieAnimationEnd = false
        this.pacman.winAnimationStart = null
        this.pacman.winAnimationEnd = false
        this.pacman.getStartingPosition()

        this.game.currentGhostState = "chase"
        this.game.ghostStateTimer = 0

        this.inputManager.direction = this.inputManager.DIRECTION_NONE
        this.inputManager.nextDirection = this.inputManager.DIRECTION_NONE
    }

    winReset() {
        this.universalReset()

        this.game.level++;

        if (this.game.ghostScatterTime > 1000) {
            this.game.ghostScatterTime -= 350
        }
        else {
            this.game.ghostScatterTime = 0
        }

        if (this.game.ghostFrightenedTime > 1000) {
            this.game.ghostFrightenedTime -= 350
            this.game.ghostBlinkTime -= 350
        }
        else {
            this.game.ghostFrightenedTime = 0
            this.game.ghostBlinkTime = 0
        }


        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].reset()
        }

        for (let i = 0; i < this.map.dots.length; i++) {
            this.map.dots[i].display = true
        }
    }

    loseReset() {
        this.universalReset()

        this.game.ghostScatterTime = 7000
        this.game.ghostFrightenedTime = 7000
        this.game.ghostBlinkTime = 4000

        for (let i = 0; i < this.ghosts.length; i++) {
            if (this.game.level < 5) {
                this.ghosts[i].speedDelay = 20
            }
            else {
                this.ghosts[i].speedDelay = 10
            }
            this.ghosts[i].reset()
        }

        this.pacman.lives--

        if (this.pacman.lives > 0) {
            return
        }

        this.game.level = 0
        this.game.score = 0
        this.pacman.lives = 3
        this.pacman.addedLifelives = false

        this.game.fruitCounter = [-1, -1, -1, -1, -1, -1, -1]
        this.map.totalNumberFruitCollected = 0

        for (let i = 0; i < this.map.dots.length; i++) {
            this.map.dots[i].display = true
        }
    }
}

