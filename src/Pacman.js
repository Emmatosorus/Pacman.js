import { element } from "three/tsl"
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
		this.heigt = 32

		this.DIRECTION_NONE = 0
		this.DIRECTION_UP = 1
		this.DIRECTION_DOWN = 2
		this.DIRECTION_LEFT = 3
		this.DIRECTION_RIGHT = 4

		this.direction = this.DIRECTION_NONE
		this.nextDirection = this.DIRECTION_NONE
		
		this.speed = 2
		this.cur_img = 0

		this.img = {}

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

		const coin = this.map.coins.find((element) => element.x === x && element.y === y)
		if (coin == null)
			return
		if (coin.display)
		{
			coin.display = false
			this.game.score++		
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
