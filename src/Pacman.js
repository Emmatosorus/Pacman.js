import Game from "./Game"

export default class Pacman
{
	constructor()
	{
		this.game = new Game()
		this.sizes = this.game.sizes
		this.time = this.game.time
		this.map = this.game.map
		this.sprites = this.game.sprites


		this.x = 0
		this.y = 0

		this.getStartingPosition()

		this.width = 32
		this.height = 32

		this.die = false

        this.currentFrame = 0;
        this.currentImage = 0;
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

	drawPacman(frameCount, animationTime, animate)
	{
		this.game.canvasContext.save();
        this.game.canvasContext.translate(
            this.x + this.map.blocksize / 2,
            this.y + this.map.blocksize / 2
        );

        this.game.canvasContext.rotate((Math.PI * 2) * this.game.inputManager.direction / 4);
		
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
            this.sprites.img[this.currentImage],
            (Math.floor(this.game.inputManager.direction === this.game.inputManager.DIRECTION_NONE ? 0 : this.currentFrame)) * this.map.blocksize,
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
			if (frameCount === this.sprites.animationFrameCount)
				this.win = true
		}
	}

	eat()
	{
		let x = Math.floor((this.x + 16) / this.map.blocksize)
		let y = Math.floor((this.y + 16) / this.map.blocksize)

		let dot = this.map.dots.find((element) => element.x === x && element.y === y)
		if (dot == null)
			return
		if (dot.display)
		{
			dot.display = false
			if (dot.big)
				this.game.score += 50
			else
				this.game.score += 10
		}
		dot = this.map.dots.find((element) => element.display === true)
		if (dot == null)
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
			this.drawPacman(this.sprites.animationFrameCount, 0.10, false)
			return
		}

		this.drawPacman(this.sprites.animationFrameCount, 0.10, true)
	}

	update()
	{
		this.game.inputManager.movePacman()
		this.eat()
		this.drawPacman(this.sprites.pacmanFrameCount, 0.125, true)
	}

}
