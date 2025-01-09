import Game from "./Game"

export default class inputManager
{
    constructor()
    {
        this.game = new Game()
        this.pacman = this.game.pacman
        this.map = this.game.map

        this.DIRECTION_RIGHT = 0
		this.DIRECTION_DOWN = 1
		this.DIRECTION_LEFT = 2
		this.DIRECTION_UP = 3
		this.DIRECTION_NONE = 4

		this.direction = this.DIRECTION_NONE
		this.nextDirection = this.DIRECTION_NONE
		
		this.speed = 2

    }

    setupKeybindings()
	{
		window.addEventListener('keydown', (KeyboardEvent) =>
		{
			if (KeyboardEvent.key === 'w' || KeyboardEvent.key === 'ArrowUp')
			{
				this.nextDirection = this.DIRECTION_UP	
			}
			if (KeyboardEvent.key === 's' || KeyboardEvent.key === 'ArrowDown')
			{
				this.nextDirection = this.DIRECTION_DOWN
			}
			if (KeyboardEvent.key === 'a' || KeyboardEvent.key === 'ArrowLeft')
			{
				this.nextDirection = this.DIRECTION_LEFT
			}
			if (KeyboardEvent.key === 'd' || KeyboardEvent.key === 'ArrowRight')
			{
				this.nextDirection = this.DIRECTION_RIGHT
			}
		})
	}

    canMove(dir)
	{
		let smallX
		let smallY
		let bigX
		let bigY

		if (dir === this.DIRECTION_UP)
		{
			smallX = Math.floor((this.pacman.x + 1) / this.map.blocksize)
			bigX = Math.floor((this.pacman.x + (this.map.blocksize - 1)) / this.map.blocksize)
			smallY = Math.ceil(this.pacman.y / this.map.blocksize) - 1
			
			if (this.map.map[smallY][smallX] == 1 || this.map.map[smallY][bigX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_DOWN)
		{
			smallX = Math.floor((this.pacman.x + 1) / this.map.blocksize)
			bigX = Math.floor((this.pacman.x + (this.map.blocksize - 1)) / this.map.blocksize)
			smallY = Math.floor(this.pacman.y / this.map.blocksize) + 1
			
			if (this.map.map[smallY][smallX] == 1 || this.map.map[smallY][bigX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_LEFT)
		{
			smallX = Math.ceil(this.pacman.x / this.map.blocksize) - 1
			smallY = Math.floor((this.pacman.y + 1) / this.map.blocksize)
			bigY = Math.floor((this.pacman.y + (this.map.blocksize - 1)) / this.map.blocksize)

			if (this.map.map[smallY][smallX] == 1 || this.map.map[bigY][smallX] == 1)
				return false
			return true
		}
		if (dir === this.DIRECTION_RIGHT)
		{
			smallX = Math.floor(this.pacman.x / this.map.blocksize) + 1
			smallY = Math.floor((this.pacman.y + 1) / this.map.blocksize)
			bigY = Math.floor((this.pacman.y + (this.map.blocksize - 1)) / this.map.blocksize)

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
			this.pacman.y -= this.speed
		}
		if (this.direction === this.DIRECTION_DOWN && this.canMove(this.direction))
		{
			this.pacman.y += this.speed
		}
		if (this.direction === this.DIRECTION_LEFT && this.canMove(this.direction))
		{
			this.pacman.x -= this.speed
		}
		if (this.direction === this.DIRECTION_RIGHT && this.canMove(this.direction))
		{
			this.pacman.x += this.speed
		}
		if (this.pacman.x < 0)
			this.pacman.x = (this.map.map[0].length - 1) * this.map.blocksize
		else if (this.pacman.x > (this.map.map[0].length - 1) * this.map.blocksize)
			this.pacman.x = 0

	}
}