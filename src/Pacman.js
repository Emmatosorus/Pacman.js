import Game from "./Game"

export default class Pacman
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes
		this.time = this.game.time
		this.map = this.game.map

		this.x = 0
		this.y = 0

		this.getStartingPosition()

		this.width = 32
		this.height = 32

		this.DIRECTION_RIGHT = 0
		this.DIRECTION_DOWN = 1
		this.DIRECTION_LEFT = 2
		this.DIRECTION_UP = 3
		this.DIRECTION_NONE = 4

		this.direction = this.DIRECTION_NONE
		this.nextDirection = this.DIRECTION_NONE
		
		this.speed = 2

		this.die = false

		this.loadSprites()
	}

	getStartingPosition()
	{
		for (let i = 0; i < this.map.map.length; i++)
		{
			for (let j = 0; j < this.map.map[0].length; j++)
			{
				if (this.map.map[i][j] === 4)
				{
					this.x = j * this.map.blocksize
					this.y = i * this.map.blocksize										
					return

				}
			}
		}
	}

	loadSprites()
	{
		this.img = {}
		this.animationFrameCount = 14;
		this.pacmanFrameCount = 4;
        this.currentFrame = 0;
        this.currentImage = 0;

		this.img[0] = new Image()
		this.img[0].src ="./static/sprites/pacman_animation.png"

		this.img[1] = new Image()
		this.img[1].src ="./static/sprites/pacman_lose.png"
	}

	canMove(dir)
	{
		let smallX
		let smallY
		let bigX
		let bigY

		if (dir === this.DIRECTION_UP)
		{
			smallX = Math.floor((this.x + 1) / this.map.blocksize)
			bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
			smallY = Math.ceil(this.y / this.map.blocksize) - 1
			
			if (this.map.map[smallY][smallX] == 1 || this.map.map[smallY][bigX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_DOWN)
		{
			smallX = Math.floor((this.x + 1) / this.map.blocksize)
			bigX = Math.floor((this.x + (this.map.blocksize - 1)) / this.map.blocksize)
			smallY = Math.floor(this.y / this.map.blocksize) + 1
			
			if (this.map.map[smallY][smallX] == 1 || this.map.map[smallY][bigX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_LEFT)
		{
			smallX = Math.ceil(this.x / this.map.blocksize) - 1
			smallY = Math.floor((this.y + 1) / this.map.blocksize)
			bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

			if (this.map.map[smallY][smallX] == 1 || this.map.map[bigY][smallX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_RIGHT)
		{
			smallX = Math.floor(this.x / this.map.blocksize) + 1
			smallY = Math.floor((this.y + 1) / this.map.blocksize)
			bigY = Math.floor((this.y + (this.map.blocksize - 1)) / this.map.blocksize)

			if (this.map.map[smallY][smallX] == 1 || this.map.map[bigY][smallX] == 1)
				return false
			return true
		}
	}

	getDirection()
	{
		if (this.nextDirection === this.DIRECTION_UP && this.canMove(this.nextDirection))
		{
			this.direction = this.DIRECTION_UP
		}
		if (this.nextDirection === this.DIRECTION_DOWN && this.canMove(this.nextDirection))
		{
			this.direction = this.DIRECTION_DOWN
		}
		if (this.nextDirection === this.DIRECTION_LEFT && this.canMove(this.nextDirection))
		{
			this.direction = this.DIRECTION_LEFT
		}
		if (this.nextDirection === this.DIRECTION_RIGHT && this.canMove(this.nextDirection))
		{
			this.direction = this.DIRECTION_RIGHT
		}
	}

	movePacman()
	{
		this.getDirection()
		if (this.direction === this.DIRECTION_UP && this.canMove(this.direction))
		{
			this.y -= this.speed
		}
		if (this.direction === this.DIRECTION_DOWN && this.canMove(this.direction))
		{
			this.y += this.speed
		}
		if (this.direction === this.DIRECTION_LEFT && this.canMove(this.direction))
		{
			this.x -= this.speed
		}
		if (this.direction === this.DIRECTION_RIGHT && this.canMove(this.direction))
		{
			this.x += this.speed
		}
		if (this.x < 0)
			this.x = (this.map.map[0].length - 1) * this.map.blocksize
		else if (this.x > (this.map.map[0].length - 1) * this.map.blocksize)
			this.x = 0

	}

	drawPacman(frameCount, animationTime, animate)
	{
		this.game.canvasContext.save();
        this.game.canvasContext.translate(
            this.x + this.map.blocksize / 2,
            this.y + this.map.blocksize / 2
        );

        this.game.canvasContext.rotate((Math.PI * 2) * this.direction / 4);
		
		this.game.canvasContext.translate(
            -this.x - this.map.blocksize / 2,
            -this.y - this.map.blocksize / 2
        );

		if (animate ===  true)
		{
			const progress = this.time.deltaTimeSeconds / animationTime
			this.currentFrame += progress;
		}
		

        this.game.canvasContext.drawImage(
            this.img[this.currentImage],
            (Math.floor(this.direction === this.DIRECTION_NONE ? 0 : this.currentFrame)) * this.map.blocksize,
            0,
            this.map.blocksize,
            this.map.blocksize,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.game.canvasContext.restore();

		if (this.currentFrame >= frameCount)
		{
			this.currentFrame = 0;
			if (frameCount === this.animationFrameCount)
				this.win = true
		}
	}

	eat()
	{
		let x = Math.floor((this.x + 16) / this.map.blocksize)
		let y = Math.floor((this.y + 16) / this.map.blocksize)

		let coin = this.map.coins.find((element) => element.x === x && element.y === y)
		if (coin == null)
			return
		if (coin.display)
		{
			coin.display = false
			if (coin.big)
				this.game.score += 50
			else
				this.game.score += 10
		}
		coin = this.map.coins.find((element) => element.display === true)
		if (coin == null)
		{
			this.game.isPlaying = false
		}
	}

	dieAnimation()
	{
		if (this.die === true)
			return

		this.currentImage = 1

		if (!this.dieAnimationStart)
			this.dieAnimationStart = this.time.currentTime

		if (this.time.currentTime < this.dieAnimationStart + 1000)
		{
			this.drawPacman(this.animationFrameCount, 0.10, false)
			return
		}

		this.drawPacman(this.animationFrameCount, 0.10, true)
	}

	update()
	{
		this.movePacman()
		this.eat()
		this.drawPacman(this.pacmanFrameCount, 0.125, true)
	}

}
