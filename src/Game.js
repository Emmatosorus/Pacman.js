import Map from "./Map.js"
import Pacman from "./Pacman.js"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"

let singletone = null

export default class Game
{
	constructor()
	{
		if (singletone !== null)
			return (singletone)
		singletone = this

		this.setupCanvas()
		
		this.sizes = new Sizes()
		this.time = new Time()
		this.map = new Map()
		this.pacman = new Pacman()

		this.score = 0

		this.inputManager()

		this.pacman.img[4].onload = () =>
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
	}

	drawScore()
	{
		// Todo
		// Load emulogic font and use it instead of Serif
		this.canvasContext.fillStyle='black'
		this.canvasContext.font = "bold 40px Serif"
		this.canvasContext.fillStyle='white'
		this.canvasContext.fillText("Score: " + this.score, 700, 100)
	}

	inputManager()
	{
		window.addEventListener('keydown', (KeyboardEvent) =>
		{
			if (KeyboardEvent.key === 'w' || KeyboardEvent.key === 'ArrowUp')
			{
				this.pacman.nextDirection = this.pacman.DIRECTION_UP				
			}
			if (KeyboardEvent.key === 's' || KeyboardEvent.key === 'ArrowDown')
			{
				this.pacman.nextDirection = this.pacman.DIRECTION_DOWN
			}
			if (KeyboardEvent.key === 'a' || KeyboardEvent.key === 'ArrowLeft')
			{
				this.pacman.nextDirection = this.pacman.DIRECTION_LEFT
			}
			if (KeyboardEvent.key === 'd' || KeyboardEvent.key === 'ArrowRight')
			{
				this.pacman.nextDirection = this.pacman.DIRECTION_RIGHT
			}
		})
	}

	update()
	{
		this.canvasContext.fillStyle='black'
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.map.update()
		this.pacman.update()
		this.drawScore()

	}
}