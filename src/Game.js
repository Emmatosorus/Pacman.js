import Map from "./Map.js"
import Pacman from "./Pacman.js"
import InputManager from "./InputManager.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Sprites from "./Utils/Sprites.js"

let singletone = null

export default class Game
{
	constructor()
	{
		if (singletone !== null)
			return (singletone)
		singletone = this

		this.setupCanvas()
		
		this.headerSpaceY = 100
		this.headerSpaceX = 10

		this.sizes = new Sizes()
		this.time = new Time()
		this.sprites = new Sprites()
		this.map = new Map()
		this.pacman = new Pacman()
		this.InputManager = new InputManager()

		this.level = 0
		
		this.fruitScores = [100, 300, 500, 700, 1000, 2000, 3000, 5000]
		
		this.isPlaying = true //true
		this.win = false //false

		this.score = 0
		this.show1UP = 0


        this.InputManager.setupKeybindings()

		this.sprites.img[this.sprites.imgNumber].onload = () =>
		{
		}
		
		this.time.on('tick', () => {
			this.update()
		})

	}

	setupCanvas()
	{
		this.canvas = document.getElementById("Screen")		
		this.canvasContext = this.canvas.getContext("2d")
		this.canvas.width = 1080
		this.canvas.height = 1350
	}

	drawScore()
	{
		this.canvasContext.fillStyle='black'
		this.canvasContext.font = "bold 24px Emulogic"
		this.canvasContext.fillStyle='white'

		const progress = this.time.deltaTime * 0.004
				
		this.show1UP += progress

		if (this.show1UP < 1)
		{
			this.canvasContext.fillText("1UP", 80, 40)
		}	

		if (this.show1UP >= 2)
			this.show1UP = 0
		
		this.canvasContext.fillText("Highscore", 240, 40)

		this.canvasContext.textAlign = 'right'
		this.canvasContext.fillText(this.score, this.canvas.width - 930, 70)
		this.canvasContext.fillText(this.score, this.canvas.width - 670, 70)
		this.canvasContext.textAlign = 'left'
	}

	winReset()
	{
		this.canvasContext.clearRect(0,
			0,
			this.canvas.width,
			this.canvas.height
		)

		this.level++;
		this.isPlaying = true
		this.win = false

		this.map.dotsCollected = 0
		this.map.numberFruitCollected = 0
		this.map.fruitCollected = true
		this.map.currentFruit = 0
		this.map.wallColor = "#342DCA"

		this.pacman.die = false
		this.pacman.currentFrame = 0;
		this.pacman.currentImage = 0;
		this.pacman.dieAnimationStart = null
		this.pacman.dieAnimationEnd = false
		this.pacman.winAnimationStart = null
		this.pacman.winAnimationEnd = false
		this.pacman.getStartingPosition()


		this.InputManager.direction = this.InputManager.DIRECTION_NONE
		this.InputManager.nextDirection = this.InputManager.DIRECTION_NONE

		for (let i = 0; i < this.map.dots.length; i++)
			this.map.dots[i].display = true
	}

	loseReset()
	{
		this.canvasContext.clearRect(0,
			0,
			this.canvas.width,
			this.canvas.height
		)

		this.level = 0
		this.score = 0
		this.isPlaying = true
		this.win = false

		this.map.dotsCollected = 0
		this.map.numberFruitCollected = 0
		this.map.fruitCollected = true
		this.map.currentFruit = 0
		this.map.wallColor = "#342DCA"

		this.pacman.die = false
		this.pacman.currentFrame = 0;
		this.pacman.currentImage = 0;
		this.pacman.dieAnimationStart = null
		this.pacman.dieAnimationEnd = false
		this.pacman.winAnimationStart = null
		this.pacman.winAnimationEnd = false
		this.pacman.getStartingPosition()


		this.InputManager.direction = this.InputManager.DIRECTION_NONE
		this.InputManager.nextDirection = this.InputManager.DIRECTION_NONE

		for (let i = 0; i < this.map.dots.length; i++)
			this.map.dots[i].display = true
	}


	update()
	{
		if (this.isPlaying === true)
		// if (this.score < 50)
		{
			this.canvasContext.fillStyle='black'
			this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)

			this.map.update()
			this.pacman.update()
			this.drawScore()
		}
		else if (this.win === true)
		{
			this.map.winAnimation()
			this.pacman.winAnimation()
			if (this.pacman.winAnimationEnd === true)
				this.winReset()
		}
		else if (this.pacman.die === true)
		{
			this.map.update()
			this.pacman.dieAnimation()
			if (this.pacman.dieAnimationEnd === true)
				this.loseReset()
		}

	}
}