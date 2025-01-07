import Map from "./Map.js"
import Pacman from "./Pacman.js"
import Sizes from "./Utils/Sizes.js"

let singletone = null

export default class Game
{
	constructor()
	{
		if (singletone !== null)
			return (singletone)
		singletone = this
		
		this.sizes = new Sizes()
		this.pacman = new Pacman()
		this.map = new Map()

		this.canvas = document.getElementById("Screen")		
		this.canvasContext = this.canvas.getContext("2d")

		this.canvasContext.canvas.width = this.sizes.width
		this.canvasContext.canvas.height = this.sizes.height

		this.canvasContext.fillStyle='black'
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
		


		this.inputManager()

		this.pacman.img[4].onload = () =>
		{
			this.update()
		}

	}

	inputManager()
	{
		window.addEventListener('keypress', (KeyboardEvent) =>
		{
			if (KeyboardEvent.key === 'w')
				this.pacman.nextDirection = 'up'
		
			if (KeyboardEvent.key === 's')
				this.pacman.nextDirection = 'down'
		
			if (KeyboardEvent.key === 'a')
				this.pacman.nextDirection = 'left'
				
			if (KeyboardEvent.key === 'd')
				this.pacman.nextDirection = 'right'
		
		})
	}

	update()
	{

		this.map.update()
		this.pacman.update()
	
		// Call tick again on the next frame
		window.requestAnimationFrame(() => {
			this.update()
		})
	}
}