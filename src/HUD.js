import Game from "./Game"

export default class HUD {
    constructor() {
        this.game = new Game()
        this.canvas = this.game.canvas
        this.canvasContext = this.game.canvasContext
        this.map = this.game.map
        this.pacman = this.game.pacman
        this.ghosts = this.game.ghosts
        this.sprites = this.game.sprites
        this.time = this.game.time

        this.score = this.game.score
        this.level = this.game.level
        this.headerSpaceY = this.game.headerSpaceY
        this.headerSpaceX = this.game.headerSpaceX

        this.show1UP = 0
    }

    drawScore() {
        this.canvasContext.font = "bold 24px Emulogic"
        this.canvasContext.fillStyle='white'

        const progress = this.time.deltaTime * 0.004

        this.show1UP += progress

        if (this.show1UP < 1) {
            this.canvasContext.fillText("1UP", 80, 40)
        }

        if (this.show1UP >= 2) {
            this.show1UP = 0
        }

        this.canvasContext.fillText("Highscore", 240, 40)
        this.canvasContext.fillText("Level", 520, 40)

        this.canvasContext.textAlign = 'right'
        this.canvasContext.fillText(this.score, this.canvas.width - 570, 70)
        this.canvasContext.fillText(this.score, this.canvas.width - 310, 70)
        this.canvasContext.fillText(this.level, this.canvas.width - 130, 70)
        this.canvasContext.textAlign = 'left'
    }

    drawPauseText() {
        this.canvasContext.font = "bold 19px Emulogic"
        if (this.pacman.lives === 3) {
            this.canvasContext.fillStyle='cyan'
            this.canvasContext.fillText("Player One", 262, 380)
        }
        this.canvasContext.font = "bold italic 19px Emulogic"
        this.canvasContext.fillStyle='yellow'
        this.canvasContext.fillText("READY!", 305, 507)
    }

    drawPacmanLives()
    {
        this.canvasContext.save();
        this.canvasContext.translate(
            (this.headerSpaceX + this.map.blocksize) + this.map.blocksize / 2,
            (this.headerSpaceY + ((this.map.map.length + 0.5) * this.map.blocksize)) + this.map.blocksize / 2
        );

        this.canvasContext.rotate(Math.PI);

        this.canvasContext.translate(
            -(this.headerSpaceX + this.map.blocksize) - this.map.blocksize / 2,
            -(this.headerSpaceY + ((this.map.map.length + 0.5) * this.map.blocksize)) - this.map.blocksize / 2
        );

        for (let i = 1; i < this.pacman.lives; i++) {
            this.canvasContext.drawImage(
                this.sprites.img[0],
                this.map.blocksize,
                0,
                this.map.blocksize,
                this.map.blocksize,
                this.headerSpaceX - (i * this.map.blocksize),
                this.headerSpaceY + ((this.map.map.length + 0.8) * this.map.blocksize),
                this.map.blocksize,
                this.map.blocksize
            )
        }

        this.canvasContext.restore();
    }

    drawGhostScore() {
        this.canvasContext.font = "12px Emulogic"
        this.canvasContext.fillStyle='cyan'
        let x = this.ghosts[this.pacman.eatenGhostIndex].x + this.headerSpaceX
        let y = this.ghosts[this.pacman.eatenGhostIndex].y + this.headerSpaceY + this.map.blocksize

        this.canvasContext.fillText(this.pacman.nbGhostsEaten * 200, x, y)
    }

    drawFruitCounter() {
        this.canvasContext.textAlign = 'right'
        for (let i = 0; i < this.game.fruitCounter.length && i < 6; i++) {
            if (this.game.fruitCounter[i] !== -1) {
                this.canvasContext.drawImage(
                    this.sprites.img[2],
                    this.map.blocksize * this.game.fruitCounter[i],
                    0,
                    this.map.blocksize,
                    this.map.blocksize,
                    this.canvas.width - this.headerSpaceX - 40 - (i * this.map.blocksize),
                    this.headerSpaceY + ((this.map.map.length + 0.2) * this.map.blocksize),
                    this.map.blocksize,
                    this.map.blocksize
                )
            }
        }
        this.canvasContext.textAlign = 'left'
    }

    update()
    {
        if (this.game.state === "playing" || this.game.state === "pause") {
            this.drawScore()
            this.drawPacmanLives()
            this.drawFruitCounter()
        }
        if (this.game.state === "pause") {
            this.drawPauseText()
        }
        if (this.game.state === "ghostEaten") {
            this.drawGhostScore()
        }
    }
}