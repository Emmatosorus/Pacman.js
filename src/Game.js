import Map from "./Map.js"
import Pacman from "./Pacman.js"
import HUD from "./HUD.js"
import InputManager from "./InputManager.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Sprites from "./Utils/Sprites.js"
import Blinky from "./Ghosts/Blinky.js"
import Pinky from "./Ghosts/Pinky.js"
import Inky from "./Ghosts/Inky.js"
import Clyde from "./Ghosts/Clyde.js"
import Reset from "./Reset"

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
		this.ghostCurrentBlink = 1
		this.currentGhostState = "chase"
		this.ghostChaseTime = 20000
		this.ghostScatterTime = 7000
		this.ghostFrightenedTime = 7000
		this.ghostBlinkTime = 4000

		this.inputManager = new InputManager()
		this.touchScreen = this.inputManager.touchScreen

		this.level = 0
		
		this.fruitScores = [100, 300, 500, 700, 1000, 2000, 3000, 5000]
		this.fruitCounter = [-1, -1, -1, -1, -1, -1, -1]
		
		this.state = "pause"

		this.score = 0
		this.Highscore = 0

		if (this.touchScreen === false) {
			this.setupKeybindingsBind = this.inputManager.setupKeybindings.bind(this.inputManager)
			window.addEventListener('keydown', this.setupKeybindingsBind)
		}
		else {
			this.joystickStartBind = this.inputManager.joystickStart.bind(this.inputManager)
			this.joystickMoveBind = this.inputManager.joystickMove.bind(this.inputManager)
			this.joystickEndBind = this.inputManager.joystickEnd.bind(this.inputManager)
			window.addEventListener('touchstart', this.joystickStartBind)
			window.addEventListener('touchmove', this.joystickMoveBind)
			window.addEventListener('touchend', this.joystickEndBind)
		}

		this.sprites.img[this.sprites.imgNumber].onload = () => {
		}

		this.HUD = new HUD()
		this.reset = new Reset()

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
					this.ghosts[i].currentFrame = 0
				}
				this.ghostCurrentBlink = 1
				this.pacman.powerup = false
				this.ghostStateTimer = 0
				this.pacman.nbGhostsEaten = 0
			}
		}
		else if (this.currentGhostState === "frightened" && this.ghostStateTimer > this.ghostBlinkTime) {
			const progress = this.time.deltaTime * 0.004
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].currentFrame = 1
			}
			this.ghostCurrentBlink += progress
			if (this.ghostCurrentBlink > 3) {
				this.ghostCurrentBlink = 1
			}
		}
	}



	update() {
		if (this.score > this.Highscore) {
			this.Highscore = this.score
		}
		this.canvasContext.fillStyle='black'
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)

		if (this.state === "playing") {
			this.map.update()
			this.pacman.update()
			this.changeGhostState()
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].update()
			}
			this.HUD.update()
		}
		else if (this.state === "pause") {
			this.map.update()
			this.pacman.update()
			if (this.pacman.lives !== 3) {
				for (let i = 0; i < this.ghosts.length; i++) {
					this.ghosts[i].update()
				}
			}
			this.HUD.update()
		}
		else if (this.state === "ghostEaten") {
			this.map.update()
			for (let i = 0; i < this.ghosts.length; i++) {
				if (i !== this.pacman.eatenGhostIndex) {
					this.ghosts[i].update()
				}
			}
			this.HUD.update()
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
				this.reset.winReset()
			}
		}
		else if (this.state === "lose") {
			this.map.update()
			this.pacman.dieAnimation()
			if (this.pacman.dieAnimationEnd === true) {
				this.reset.loseReset()
			}
			this.HUD.drawPacmanLives()
		}
	}

	cleanup() {
		window.removeEventListener('beforeunload', this.cleanupBind)
		cancelAnimationFrame(this.time.request)

		if (this.touchScreen === false) {
			window.removeEventListener('keydown', this.setupKeybindingsBind)
		}
		else {
			window.removeEventListener('touchstart', this.joystickStartBind)
			window.removeEventListener('touchmove', this.joystickMoveBind)
			window.removeEventListener('touchend', this.joystickEndBind)
		}

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