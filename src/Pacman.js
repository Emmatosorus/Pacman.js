import Game from "./Game"

export default class Pacman
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes

		this.x = this.sizes.width / 2 - 16
		this.y = this.sizes.height / 2 - 16
		this.width = 32
		this.heigt = 32

		this.nextDirection = 'none'
		this.speed = 2
		this.moved = 0

		this.img = {}

		this.img[0] = new Image()
		this.img[0].src ="./static/pacman_closed.png"

		this.img[1] = new Image()
		this.img[1].src ="./static/pacman_up.png"

		this.img[2] = new Image()
		this.img[2].src ="./static/pacman_down.png"

		this.img[3] = new Image()
		this.img[3].src ="./static/pacman_left.png"

		this.img[4] = new Image()
		this.img[4].src ="./static/pacman_right.png"
	
	}

	update()
	{
		let cur_img = Math.round(this.moved / this.width) % 2

		if (this.nextDirection === 'up')
		{
			this.y -= this.speed
		}
		if (this.nextDirection === 'down')
		{
			this.y += this.speed
			cur_img !== 0 ? cur_img = 2 : cur_img = 0
		}
		if (this.nextDirection === 'left')
		{
			this.x -= this.speed
			cur_img !== 0 ? cur_img = 3 : cur_img = 0
		}
		if (this.nextDirection === 'right')
		{
			this.x += this.speed
			cur_img !== 0 ? cur_img = 4 : cur_img = 0
		}
		if (this.nextDirection !== 'none')
			this.moved += 1

		this.game.canvasContext.drawImage(this.img[cur_img], this.x, this.y)
	}
}
