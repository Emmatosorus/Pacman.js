import Game from "./Game.js"

export default class Map
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes
		this.sprites = this.game.sprites
		this.time = this.game.time


		// Setup
		this.width = this.game.sizes.width
		this.heigth = this.game.sizes.height
		this.blocksize = 32
		this.wallBorder = 8
		this.wallWidth = 2
		this.wallOffset = this.blocksize * 0.5;
		this.cornerRads = 6
		this.x = 0
		this.y = 0

		this.wallColor = "#342DCA"
		this.pathColor = "black"
		this.dotColor = "#ffbaad"

		this.dotsCollected = 0
		this.fruitCollected = true
		this.numberFruitCollected = 0
		this.fruitSpawnTime = 0
		this.currentFruit = 0

		this.normalWallColor = "#342DCA"
		this.winWallColor = "#caa2db"
		this.currentColor = 0
		this.winAnimationTime = 0.0048

		this.dots = []

		this.PATH = 0
		this.WALL = 1
		this.DOT = 2
		this.POWER_PELLET = 3
		this.PACMAN = 4
		this.FRUIT = 5
		this.BLINKY = 6
		this.PINKY = 7
		this.INKY = 8
		this.CLYDE = 9

		this.map = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1],
			[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
			[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
			[1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
			[1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
			[1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 6, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0, 2, 0, 0, 1, 8, 7, 9, 1, 0, 0, 2, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
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

		this.upForbidden = [[8, 9], [8, 10], [8, 11],
							[16, 9], [16, 10], [16, 11]]

		this.savedots()

	}

	savedots()
	{
		for (let i = 0; i < this.map.length; i++)
		{
			for (let j = 0; j < this.map[0].length; j++)
			{
				if (this.map[i][j] === this.DOT)
					this.dots.push({x: j, y: i, display: true, big: false})
				if (this.map[i][j] === this.POWER_PELLET)
					this.dots.push({x: j, y: i, display: true, big: true})
			}
		}
	}

	drawWall(x, y)
	{
		const corner = [0, 0, 0, 0]

		if (y > 0 && this.map[y - 1][x] !== this.WALL && x > 0 && this.map[y][x - 1] !== this.WALL)
			corner[0] = this.cornerRads
		if (y > 0 && this.map[y - 1][x] !== this.WALL && x < this.map[0].length - 1 && this.map[y][x + 1] !== this.WALL)
			corner[1] = this.cornerRads
		if (y < this.map.length - 1 && this.map[y + 1][x] !== this.WALL && x < this.map[0].length - 1 && this.map[y][x + 1] !== this.WALL)
			corner[2] = this.cornerRads
		if (y < this.map.length - 1 && this.map[y + 1][x] !== this.WALL && x > 0 && this.map[y][x - 1] !== this.WALL )
			corner[3] = this.cornerRads

		this.game.canvasContext.strokeStyle = this.wallColor
		this.game.canvasContext.fillStyle = this.wallColor
		this.game.canvasContext.lineWidth = this.wallWidth
		this.game.canvasContext.beginPath();
		this.game.canvasContext.roundRect(
			x * this.blocksize + this.game.headerSpaceX,
			y * this.blocksize + this.game.headerSpaceY,
			this.blocksize,
			this.blocksize,
			corner
		)
		this.game.canvasContext.stroke()


		this.game.canvasContext.fillStyle = this.pathColor

		if (x > 0 && this.map[y][x - 1] === this.WALL)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize + this.game.headerSpaceX - this.wallBorder,
				y * this.blocksize + this.game.headerSpaceY + (this.wallBorder * 0.5 - 3),
				this.blocksize - (this.wallBorder) + 1,
				this.blocksize - (this.wallBorder * 0.5) + 2
			)
		}

		if (y > 0 && this.map[y - 1][x] === this.WALL)
		{
			this.game.canvasContext.fillRect(
				x * this.blocksize + this.game.headerSpaceX + (this.wallBorder * 0.5 - 3),
				y * this.blocksize + this.game.headerSpaceY - this.wallBorder,
				this.blocksize - (this.wallBorder * 0.5) + 2,
				this.blocksize - this.wallBorder + 1
			)
		}
	}

	hideTunnel()
	{
		this.game.canvasContext.fillStyle = this.pathColor
		this.game.canvasContext.fillRect(
			0,
			(this.blocksize * 12) + this.wallBorder - 3,
			this.wallBorder * 2,
			this.blocksize - this.wallBorder * 0.5 + 2
		)

		this.game.canvasContext.fillRect(
			0,
			(this.blocksize * 14) + this.wallBorder - 3,
			this.wallBorder * 2,
			this.blocksize - this.wallBorder * 0.5 + 2
		)

		this.game.canvasContext.fillRect(
			this.blocksize * (this.map[0].length),
			(this.blocksize * 12) + this.wallBorder - 3,
			this.wallBorder * 2,
			this.blocksize - this.wallBorder * 0.5 + 2
		)

		this.game.canvasContext.fillRect(
			this.blocksize * (this.map[0].length),
			(this.blocksize * 14) + this.wallBorder - 3,
			this.wallBorder * 2,
			this.blocksize - this.wallBorder * 0.5 + 2
		)
	}

	drawDot(x, y)
	{
		let found = this.dots.find((element) => element.x === x && element.y === y)
		if (found == null || found.display !== true)
			return
		if (found.big)
		{
			this.game.canvasContext.fillStyle = this.dotColor
			this.game.canvasContext.beginPath();
			this.game.canvasContext.arc(
				x * this.blocksize + (this.blocksize * 0.5) + this.game.headerSpaceX,
				y * this.blocksize + (this.blocksize * 0.5) + this.game.headerSpaceY,
				10,
				0,
				Math.PI * 2,
				true)
			this.game.canvasContext.fill();
		}
		else
		{
			this.game.canvasContext.fillStyle = this.dotColor
			this.game.canvasContext.beginPath();
			this.game.canvasContext.roundRect(
				(x * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5 + this.game.headerSpaceX,
				(y * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5 + this.game.headerSpaceY,
				this.blocksize * 0.150,
				this.blocksize * 0.150,
				[2, 2, 2, 2]
			)
			this.game.canvasContext.fill()
		}
	}

	drawFruit(x, y)
	{
		if (this.fruitCollected !== false || this.map[y][x] !== this.FRUIT)
			return
		
		this.game.canvasContext.drawImage(
			this.sprites.img[2],
			(this.currentFruit) * this.blocksize,
			0,
			this.blocksize,
			this.blocksize,
			x * this.blocksize + this.game.headerSpaceX,
			y * this.blocksize + this.game.headerSpaceY,
			this.blocksize,
			this.blocksize
		)
	}

	drawMap()
	{
		for (let y = 0; y < this.map.length; y++)
		{
			for (let x = 0; x < this.map[0].length; x++)
			{
				if (this.map[y][x] === this.WALL)
				{
					this.drawWall(x, y)
					this.game.canvasContext.lineWidth = 1
				}
				else
				{
					this.game.canvasContext.fillStyle = this.pathColor
					this.game.canvasContext.fillRect(
						x * this.blocksize + this.game.headerSpaceX + this.wallBorder,
						y * this.blocksize + this.game.headerSpaceY + this.wallBorder,
						this.blocksize - this.wallBorder,
						this.blocksize - this.wallBorder
					)
					this.drawDot(x, y)
					this.drawFruit(x, y)
				}
			}
		}
		this.hideTunnel()
	}

	winAnimation()
	{
		const progress = this.time.deltaTime * this.winAnimationTime
				
		this.currentColor += progress

		this.currentColor < 1 ? this.wallColor = this.winWallColor : this.wallColor = this.normalWallColor		

		if (this.currentColor >= 2)
			this.currentColor = 0

		this.drawMap()
	}

	handleFruit()
	{
		if (((this.numberFruitCollected === 0 &&
			this.dotsCollected === 50) || // 50
			(this.numberFruitCollected === 1 &&
			this.dotsCollected === 120))) // 120
		{			
			this.fruitSpawnTime = this.time.currentTimeSeconds
			this.fruitCollected = false

			if (this.game.level >= 15)
				this.currentFruit = this.sprites.fruitFrameCount - 1
			else if (this.game.level >= 8 && this.game.level <= 14)
				this.currentFruit = (this.game.level - 7) % this.sprites.fruitFrameCount
			else
				this.currentFruit = this.game.level % this.sprites.fruitFrameCount
			
		}
		if (this.fruitCollected === false && this.fruitSpawnTime + 7 < this.time.currentTimeSeconds)
		{
			this.fruitCollected = true
			this.numberFruitCollected = 1
		}
	}

	update()
	{
		this.handleFruit()
		this.drawMap()
	}
}