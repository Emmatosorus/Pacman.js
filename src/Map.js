import Game from "./Game.js"

export default class Map
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes

		this.img = new Image()
		this.img.src ="./static/empty_map.jpg"

		this.width = 664
		this.heigth = 737
		this.x = (this.sizes.width / 2) - (this.width / 2)
		this.y = (this.sizes.height / 2) - (this.heigth / 2 * 1.13)



		this.map = [
			'1111111111111111111111111111',
			'1000000000000000000000000001',
			'1111111111111111111111111111'
		]

		this.img.onload = () =>
		{
			this.update()
		}
	}

	update()
	{
		this.game.canvasContext.drawImage(this.img, this.x, this.y)
	}
}