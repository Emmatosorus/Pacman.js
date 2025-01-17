import Map from "./Map.js"
import Pacman from "./Pacman.js"
import InputManager from "./InputManager.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Sprites from "./Utils/Sprites.js"
import Blinky from "./Ghosts/Blinky.js"
import Pinky from "./Ghosts/Pinky.js"
import Inky from "./Ghosts/Inky.js"
import Clyde from "./Ghosts/Clyde.js"

let singletone = null

export default class Game {
	constructor() {
		if (singletone !== null) {
			return (singletone)
		}
		singletone = this

		this.setupCanvas()
		
		this.headerSpaceY = 100
		this.headerSpaceX = 24

		this.sizes = new Sizes()
		this.time = new Time()
		this.sprites = new Sprites()
		this.map = new Map()
		this.pacman = new Pacman()

		this.ghosts = []
		this.ghosts.push(new Blinky(this.map.BLINKY))
		this.ghosts.push(new Pinky(this.map.PINKY))
		this.ghosts.push(new Inky(this.map.INKY))
		this.ghosts.push(new Clyde(this.map.CLYDE))
		this.ghostStateTimer = 0
		this.ghostCurrentBlink = 0
		this.currentGhostState = "chase"
		this.ghostChaseTime = 20000
		this.ghostScatterTime = 7000
		this.ghostFrightenedTime = 7000
		this.ghostBlinkTime = 4000

		this.inputManager = new InputManager()

		this.level = 0
		
		this.fruitScores = [100, 300, 500, 700, 1000, 2000, 3000, 5000]
		
		this.state = "pause"

		this.score = 0
		this.show1UP = 0

		this.setupKeybindingsBind = this.inputManager.setupKeybindings.bind(this.inputManager)
		window.addEventListener('keydown', this.setupKeybindingsBind)

		this.sprites.img[this.sprites.imgNumber].onload = () => {
		}

		this.cleanupBind = this.cleanup.bind(this)
		window.addEventListener('beforeunload', this.cleanupBind)
		
		this.time.on('tick', () => {
			this.update()
		})

	}

	setupCanvas() {
		this.canvas = document.getElementById("Screen")		
		this.canvasContext = this.canvas.getContext("2d")
		this.canvas.style.position = 'absolute'
		this.canvas.style.top = "10px"
		this.canvas.style.left = "10px"
		this.canvas.width = 720
		this.canvas.height = 900
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

	changeGhostState() {
		this.ghostStateTimer += this.time.deltaTime
		if (this.currentGhostState === "chase" && this.ghostStateTimer > this.ghostChaseTime &&
			this.ghostScatterTime !== 0) {
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].changeState = true
			}
			this.ghostStateTimer = 0
		}
		else if (this.currentGhostState === "scatter" && this.ghostStateTimer > this.ghostScatterTime) {
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].changeState = true
			}
			this.ghostStateTimer = 0
		}
		if (this.currentGhostState === "frightened" && this.ghostStateTimer > this.ghostFrightenedTime) {
			for (let i = 0; i < this.ghosts.length; i++) {
				if (this.ghosts[i].state === "frightened") {
					this.ghosts[i].changeState = true
				}
				this.ghostCurrentBlink = 0
				this.pacman.powerup = false
				this.ghostStateTimer = 0
				this.pacman.nbGhostsEaten = 0
			}
		}
		else if (this.currentGhostState === "frightened" && this.ghostStateTimer > this.ghostBlinkTime) {
			const progress = this.time.deltaTime * 0.004
			this.ghostCurrentBlink += progress
			if (this.ghostCurrentBlink > 3) {
				this.ghostCurrentBlink = 1
			}
		}
	}

	winReset() {
		this.canvasContext.clearRect(0,
			0,
			this.canvas.width,
			this.canvas.height
		)

		this.level++;
		this.state = "pause"

		if (this.ghostScatterTime > 1000) {
			this.ghostScatterTime -= 350
		}
		else {
			this.ghostScatterTime = 0
		}

		if (this.ghostFrightenedTime > 1000) {
			this.ghostFrightenedTime -= 350
			this.ghostBlinkTime -= 350
		}
		else {
			this.ghostFrightenedTime = 0
			this.ghostBlinkTime = 0
		}

		this.map.dotsCollected = 0
		this.map.numberFruitCollected = 0
		this.map.fruitCollected = true
		this.map.currentFruit = 0
		this.map.wallColor = "#342DCA"

		this.pacman.currentFrame = 0;
		this.pacman.currentImage = 0;
		this.pacman.dieAnimationStart = null
		this.pacman.dieAnimationEnd = false
		this.pacman.winAnimationStart = null
		this.pacman.winAnimationEnd = false
		this.pacman.getStartingPosition()

		for (let i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].reset()
		}
		this.ghostStateTimer = 0

		this.inputManager.direction = this.inputManager.DIRECTION_NONE
		this.inputManager.nextDirection = this.inputManager.DIRECTION_NONE

		for (let i = 0; i < this.map.dots.length; i++) {
			this.map.dots[i].display = true
		}
	}

	loseReset() {
		this.canvasContext.clearRect(0,
			0,
			this.canvas.width,
			this.canvas.height
		)

		this.state = "pause"
		this.ghostScatterTime = 7000
		this.ghostFrightenedTime = 7000
		this.ghostBlinkTime = 4000

		this.map.dotsCollected = 0
		this.map.numberFruitCollected = 0
		this.map.fruitCollected = true
		this.map.currentFruit = 0
		this.map.wallColor = "#342DCA"

		this.pacman.currentFrame = 0;
		this.pacman.currentImage = 0;
		this.pacman.dieAnimationStart = null
		this.pacman.dieAnimationEnd = false
		this.pacman.winAnimationStart = null
		this.pacman.winAnimationEnd = false
		this.pacman.getStartingPosition()

		for (let i = 0; i < this.ghosts.length; i++) {
			if (this.level < 5) {
				this.ghosts[i].speedDelay = 20
			}
			else {
				this.ghosts[i].speedDelay = 10
			}
			this.ghosts[i].moveDelay = 0
			this.ghosts[i].getStartingPosition()
		}
		this.ghostStateTimer = 0

		this.inputManager.direction = this.inputManager.DIRECTION_NONE
		this.inputManager.nextDirection = this.inputManager.DIRECTION_NONE

		this.pacman.lives--

		if (this.pacman.lives > 0) {
			return
		}

		this.level = 0
		this.score = 0
		this.pacman.lives = 3
		this.pacman.addedLifelives = false

		for (let i = 0; i < this.map.dots.length; i++) {
			this.map.dots[i].display = true
		}
	}

	update() {
		this.canvasContext.fillStyle='black'
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)

		if (this.state === "playing") {
			this.map.update()
			this.pacman.update()
			this.changeGhostState()
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].update()
			}
			this.drawScore()
			this.drawPacmanLives()
		}
		else if (this.state === "pause") {
			this.map.update()
			this.pacman.update()
			if (this.pacman.lives !== 3) {
				for (let i = 0; i < this.ghosts.length; i++) {
					this.ghosts[i].update()
				}
			}
			this.drawScore()
			this.drawPauseText()
			this.drawPacmanLives()
		}
		else if (this.state === "ghostEaten") {
			this.map.update()
			for (let i = 0; i < this.ghosts.length; i++) {
				if (i !== this.pacman.eatenGhostIndex) {
					this.ghosts[i].update()
				}
			}
			this.drawScore()
			this.drawPacmanLives()
			this.drawGhostScore()
			if (this.time.currentTime >= this.pacman.ghostEatStart + 750) {
				this.state = "playing"
			}
		}
		else if (this.state === "win") {
			this.map.winAnimation()
			this.pacman.winAnimation()
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].update()
			}
			if (this.pacman.winAnimationEnd === true) {
				this.winReset()
			}
		}
		else if (this.state === "lose") {
			this.map.update()
			this.pacman.dieAnimation()
			if (this.pacman.dieAnimationEnd === true) {
				this.loseReset()
			}
			this.drawPacmanLives()
		}
	}

	cleanup() {
		window.removeEventListener('beforeunload', this.cleanupBind)
		cancelAnimationFrame(this.time.request)

		this.time.cleanup()
		this.inputManager.cleanup()

		for (let i = 0; i < this.ghosts.length; i++) {
			this.ghosts[i].cleanup()
		}

		for (const key of Object.keys(this)) {
			this[key] = null
		}
	}
}