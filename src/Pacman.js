import Game from "./Game"

export default class Pacman
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes
		this.time = this.game.time
		this.map = this.game.map

		this.x = ((this.map.map.length / 2) - 1.5) * this.map.blocksize
		this.y = ((this.map.map.length / 2) + 1.5) * this.map.blocksize
		this.width = 32
		this.height = 32

		this.DIRECTION_NONE = 0
		this.DIRECTION_UP = 1
		this.DIRECTION_DOWN = 2
		this.DIRECTION_LEFT = 3
		this.DIRECTION_RIGHT = 4

		this.direction = this.DIRECTION_NONE
		this.nextDirection = this.DIRECTION_NONE
		
		this.speed = 2
		this.cur_img = 0

		this.win = false

		this.loadSprites()
	}

	loadSprites()
	{
		this.img = {}
		this.frameCount = 6;
        this.currentFrame = 1;

		this.img[0] = new Image()
		this.img[0].src ="./static/sprites/pacman_closed.png"

		this.img[1] = new Image()
		this.img[1].src ="./static/sprites/pacman_up.png"

		this.img[2] = new Image()
		this.img[2].src ="./static/sprites/pacman_down.png"

		this.img[3] = new Image()
		this.img[3].src ="./static/sprites/pacman_left.png"

		this.img[4] = new Image()
		this.img[4].src ="./static/sprites/pacman_right.png"

		this.img[5] = new Image()
		this.img[5].src ="./static/sprites/pacman_win.png"
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

	chooseSprite()
	{
		if ((this.time.elapsedTime * 0.1) % 64 < 32)
		{
			this.cur_img = 0
			return
		}

		switch(this.direction)
		{
			case this.DIRECTION_UP:
			{
				this.cur_img = 1
				break
			}
			case this.DIRECTION_DOWN:
			{
				this.cur_img = 2
				break
			}
			case this.DIRECTION_LEFT:
			{
				this.cur_img = 3
				break
			}
			case this.DIRECTION_RIGHT:
			{
				this.cur_img = 4
			}
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
			this.game.score++
		}
		coin = this.map.coins.find((element) => element.display === true)
		if (coin == null)
		{
			this.game.isPlaying = false
		}
	}

	winAnimation()
	{
		if (this.win === true)
			return

		const animationTime = 0.25

		const progress = this.time.deltaTimeSeconds / animationTime
		
		this.currentFrame += progress;
		
		let angle = 0

		switch(this.direction)
		{
			case this.DIRECTION_UP:
			{
				angle = -Math.PI / 2
				break
			}
			case this.DIRECTION_DOWN:
			{
				angle = Math.PI / 2
				break
			}
			case this.DIRECTION_LEFT:
			{
				angle = Math.PI
				break
			}
			case this.DIRECTION_RIGHT:
			{
				angle = 0
				break
			}
		}

		this.game.canvasContext.save();
        this.game.canvasContext.translate(
            this.x + this.map.blocksize / 2,
            this.y + this.map.blocksize / 2
        );
        this.game.canvasContext.rotate(angle);
		
		this.game.canvasContext.translate(
            -this.x - this.map.blocksize / 2,
            -this.y - this.map.blocksize / 2
        );
        
        this.game.canvasContext.drawImage(
            this.img[5],
            (Math.floor(this.currentFrame - 1)) * this.map.blocksize,
            0,
            this.map.blocksize,
            this.map.blocksize,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.game.canvasContext.restore();

		if (this.currentFrame > this.frameCount)
		{
			this.win = true
		}
		
	}

	update()
	{
		this.movePacman()
		this.chooseSprite()
		this.eat()
	
		this.game.canvasContext.drawImage(this.img[this.cur_img], this.x, this.y)
	}

}
