import Game from "./Game.js"

export default class Map
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes
		this.sprites = this.game.sprites


		// Setup
		this.width = this.game.sizes.width
		this.heigth = this.game.sizes.height
		this.blocksize = 32
		this.wallSpaceWidth = this.blocksize * 0.8;
		this.wallOffset = (this.blocksize - this.wallSpaceWidth) / 2;
		this.x = 0
		this.y = 0

		this.wallColor = "#342DCA"
		this.pathColor = "black"
		this.dotColor = "#caa2db"

		this.dotsCollected = 0
		this.fruitCollected = true
		this.numberFruitCollected = 0


		this.dots = []

		this.map = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1],
			[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
			[1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
			[1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 5, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
			[1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 1, 2, 2, 3, 1],
			[1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
			[1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
			[1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		];

		this.savedots()

	}

	savedots()
	{
		for (let i = 0; i < this.map.length; i++)
		{
			for (let j = 0; j < this.map[0].length; j++)
			{
				if (this.map[i][j] === 2)
					this.dots.push({x: j, y: i, display: true, big: false})
				if (this.map[i][j] === 3)
					this.dots.push({x: j, y: i, display: true, big: true})
			}
		}
	}

	drawWall(x, y)
	{
		this.game.canvasContext.fillStyle = this.wallColor
		this.game.canvasContext.fillRect(
			x * this.blocksize,
			y * this.blocksize,
			this.blocksize,
			this.blocksize
		)

		this.game.canvasContext.fillStyle = this.pathColor
		if (x > 0 && this.map[y][x - 1] == 1)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize,
				y * this.blocksize + this.wallOffset,
				this.wallSpaceWidth + this.wallOffset,
				this.wallSpaceWidth
			)
		}

		if (x < this.map[0].length - 1 && this.map[y][x + 1] == 1)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize + this.wallOffset,
				y * this.blocksize + this.wallOffset,
				this.wallSpaceWidth + this.wallOffset,
				this.wallSpaceWidth
			)
		}

		if (y < this.map.length - 1 && this.map[y + 1][x] == 1)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize + this.wallOffset,
				y * this.blocksize + this.wallOffset,
				this.wallSpaceWidth,
				this.wallSpaceWidth + this.wallOffset
			)
		}

		if (y > 0 && this.map[y - 1][x] == 1)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize + this.wallOffset,
				y * this.blocksize,
				this.wallSpaceWidth,
				this.wallSpaceWidth + this.wallOffset
			)
		}
	}

	drawMap()
	{
		for (let y = 0; y < this.map.length; y++)
		{
			for (let x = 0; x < this.map[0].length; x++)
			{
				if (this.map[y][x] === 1)
				{
					this.drawWall(x, y)
				}
				else
				{
					this.game.canvasContext.fillStyle = this.pathColor
					this.game.canvasContext.fillRect(
						x * this.blocksize,
						y * this.blocksize,
						this.blocksize,
						this.blocksize
					)
					let found = this.dots.find((element) => element.x === x && element.y === y)
					if (found != null && found.display === true)
					{
						if (found.big)
						{
							this.game.canvasContext.fillStyle = this.dotColor
							this.game.canvasContext.beginPath();
							this.game.canvasContext.arc(
								x * this.blocksize + (this.blocksize * 0.5),
								y * this.blocksize + (this.blocksize * 0.5),
								10,
								0,
								Math.PI * 2,
								true)
							this.game.canvasContext.fill();
						}
						else
						{
							this.game.canvasContext.fillStyle = this.dotColor
							this.game.canvasContext.fillRect(
								(x * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5,
								(y * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5,
								this.blocksize * 0.125,
								this.blocksize * 0.125
							)
						}
					}
					else if (this.fruitCollected === false && this.map[y][x] === 5)
					{
						this.game.canvasContext.drawImage(
							this.sprites.img[2],
							(this.game.level % this.sprites.fruitFrameCount) * this.blocksize,
							0,
							this.blocksize,
							this.blocksize,
							x * this.blocksize,
							y * this.blocksize,
							this.blocksize,
							this.blocksize
						)
					}
				}
			}
		}
	}

	update()
	{
		if (((this.numberFruitCollected === 0 &&
			this.dotsCollected === 50) || // 50
			(this.numberFruitCollected === 1 &&
			this.dotsCollected === 120))) // 120
		{
			this.fruitCollected = false
		}

		this.drawMap()
	}
}