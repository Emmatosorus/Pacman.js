import Game from "./Game"

export default class Pacman {
	constructor() {
		this.game = new Game()
		this.time = this.game.time
		this.map = this.game.map
		this.sprites = this.game.sprites
		this.ghosts = null

		this.x = 0
		this.y = 0

		this.getStartingPosition()

		this.width = this.map.blocksize
		this.height = this.map.blocksize

        this.currentFrame = 0;
        this.currentImage = 0;
		this.dieAnimationStart = null
		this.dieAnimationEnd = false

		this.winAnimationStart = null
		this.winAnimationEnd = false

		this.addedLife = false
		this.lives = 3

		this.powerup = false
		this.nbGhostsEaten = 0
	}

	getStartingPosition()
	{
		for (let i = 0; i < this.map.map.length; i++) {
			for (let j = 0; j < this.map.map[0].length; j++) {
				if (this.map.map[i][j] === this.map.PACMAN) {
					this.x = (j * this.map.blocksize)
					this.y = (i * this.map.blocksize)		
					return
				}
			}
		}
	}

	drawPacman(maxFrame, animationTime, animate) {
		
		this.game.canvasContext.save();
        this.game.canvasContext.translate(
            (this.x + this.game.headerSpaceX) + this.map.blocksize / 2,
            (this.y + this.game.headerSpaceY) + this.map.blocksize / 2
        );

        this.game.canvasContext.rotate((Math.PI * 2) * this.game.inputManager.direction / 4);
		
		this.game.canvasContext.translate(
            -(this.x + this.game.headerSpaceX) - this.map.blocksize / 2,
            -(this.y + this.game.headerSpaceY) - this.map.blocksize / 2
        );

		if (animate ===  true) {
			const progress = this.time.deltaTime * animationTime
			this.currentFrame += progress;			
		}

		if (this.currentFrame >= maxFrame) {

			this.currentFrame = 0;
			if (maxFrame === this.sprites.animationFrameCount) {
				this.dieAnimationEnd = true
			}

		}
				
        this.game.canvasContext.drawImage(
            this.sprites.img[this.currentImage],
            Math.floor(this.game.inputManager.direction === this.game.inputManager.DIRECTION_NONE && maxFrame !== this.sprites.animationFrameCount ? 0 : this.currentFrame) * this.map.blocksize,
            0,
            this.map.blocksize,
            this.map.blocksize,
            this.x + this.game.headerSpaceX,
            this.y + this.game.headerSpaceY,
            this.width,
            this.height
        );

        this.game.canvasContext.restore();
	}

	checkGhostCollision() {
		if (this.ghosts === null)
			this.ghosts = this.game.ghosts

		const x = this.x + (this.map.blocksize * 0.5)
		const y = this.y + (this.map.blocksize * 0.5)

		for (let i = 0; i < this.ghosts.length; i++) {
			let ghostA = [this.ghosts[i].x, this.ghosts[i].y]
			let ghostB = [this.ghosts[i].x + this.map.blocksize, this.ghosts[i].y]
			let ghostC = [this.ghosts[i].x, this.ghosts[i].y + this.map.blocksize]

			if (x >= ghostA[0] && x <= ghostB[0] && y >= ghostA[1] && y <= ghostC[1]) {
				if (this.ghosts[i].state === "frightened") {
					this.ghosts[i].state = "eaten"
					this.nbGhostsEaten++
					this.game.score += 200 * this.nbGhostsEaten
				}
				else if (this.ghosts[i].state !== "eaten") {
					this.game.state = "lose"
				}
			}
		}
	}

	eat() {
		let x = Math.floor((this.x + this.map.blocksize * 0.5) / this.map.blocksize)
		let y = Math.floor((this.y + this.map.blocksize * 0.5) / this.map.blocksize)

		let dot = this.map.dots.find((element) => element.x === x && element.y === y)
		if (dot == null) {
			if (this.map.map[y][x] === this.map.FRUIT && this.map.fruitCollected === false) {
				this.map.fruitCollected = true
				this.game.score += this.game.fruitScores[this.map.currentFruit]
				this.game.map.numberFruitCollected++
			}
			return
		}
		if (dot.display) {
			dot.display = false
			if (dot.big) {
				this.game.score += 50
				this.powerup = true
				for (let i = 0; i < this.ghosts.length; i++) {
					this.ghosts[i].state = "frightened"
					this.ghosts[i].changeState = true
				}
				this.game.ghostStateTimer = 0
				this.game.currentGhostState = "frightened"
			}
			else {
				this.game.score += 10
				if (this.ghosts[2].inHouse === true) {
					this.ghosts[2].dotCounter++
				}
				else if (this.ghosts[3].inHouse === true) {
					this.ghosts[3].dotCounter++
				}
			}
			this.map.dotsCollected++
		}
		dot = this.map.dots.find((element) => element.display === true)
		if (dot == null) {
			this.game.state = "win"
		}
	}

	winAnimation() {
		this.currentImage = 1
		this.currentFrame = 0

		if (this.winAnimationStart === null) {
			this.winAnimationStart = this.time.currentTimeSeconds
		}

		if (this.time.currentTimeSeconds < this.winAnimationStart + 3) {
			this.drawPacman(this.sprites.animationFrameCount, 0.01, false)
		}
		else {
			this.winAnimationEnd = true
		}
	}

	dieAnimation()
	{
		this.currentImage = 1

		if (this.dieAnimationStart === null) {
			this.dieAnimationStart = this.time.currentTimeSeconds
		}

		if (this.time.currentTimeSeconds < this.dieAnimationStart + 2) {
			this.drawPacman(this.sprites.animationFrameCount, 0.01, false)
			for (let i = 0; i < this.ghosts.length; i++) {
				this.ghosts[i].draw()
			}
			return
		}

		this.drawPacman(this.sprites.animationFrameCount, 0.01, true)
	}

	update()
	{
		if (this.game.state === "playing") {
			if (this.game.score > 7100 && this.addedLife === false) {
				this.addedLife = true
				this.lives++
			}
			this.game.inputManager.movePacman()
			this.checkGhostCollision()
			this.eat()
		}
		this.drawPacman(this.sprites.pacmanFrameCount, 0.01, true)
	}

	cleanup() {
		for (const key of Object.keys(this)) {
			this[key] = null
		}
	}

}
