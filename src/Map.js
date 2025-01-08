import Game from "./Game.js"

export default class Map
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes


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
		this.coinColor = "#caa2db"

		this.coins = []

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
			[0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
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

		this.saveCoins()

	}

	saveCoins()
	{
		for (let i = 0; i < this.map.length; i++)
		{
			for (let j = 0; j < this.map[0].length; j++)
			{
				if (this.map[i][j] === 2)
					this.coins.push({x: j, y: i, display: true, big: false})
				if (this.map[i][j] === 3)
					this.coins.push({x: j, y: i, display: true, big: true})
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
					let found = this.coins.find((element) => element.x === x && element.y === y)
					if (found != null && found.display === true)
					{
						if (found.big)
						{
							this.game.canvasContext.fillStyle = this.coinColor
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
							this.game.canvasContext.fillStyle = this.coinColor
							this.game.canvasContext.fillRect(
								(x * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5,
								(y * this.blocksize) + (this.blocksize - (this.blocksize * 0.125)) * 0.5,
								this.blocksize * 0.125,
								this.blocksize * 0.125
							)
						}
					}
				}
			}
		}
	}

	update()
	{
		this.drawMap()
	}
}