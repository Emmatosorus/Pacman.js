import Game from '../Game.js'
import EventEmitter from './EventEmitter.js'


export default class Sizes extends EventEmitter
{
	constructor()
	{
		super()

		this.game = new Game()

		// Setup
		this.width = this.game.canvas.width
		this.height = this.game.canvas.height
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		// Resize event
		// window.addEventListener('resize', () =>
		// {
		// 	this.width = window.innerWidth
		// 	this.height = window.innerHeight
		// 	this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		// 	this.trigger('resize')
		// })
	}
}