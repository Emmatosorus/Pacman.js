export default class Sprites {
    constructor() {
        this.imgNumber = 2
        this.img = {}

        
        this.img[0] = new Image()
		this.img[0].src ="sprites/pacman_animation.png"
		this.pacmanFrameCount = 4;
        
		this.img[1] = new Image()
		this.img[1].src ="sprites/pacman_lose.png"
        this.animationFrameCount = 14;

        this.img[2] = new Image()
		this.img[2].src ="sprites/fruit.png"
        this.fruitFrameCount = 8;

        this.img[3] = new Image()
        this.img[3].src ="sprites/ghosts.png"
    }

    cleanup() {
        for (const key of Object.keys(this)) {
            this[key] = null
        }
    }
}