import Game from "./Game"

export default class Sprites
{
    constructor()
    {
        this.imgNumber = 2
        this.img = {}

        
        this.img[0] = new Image()
		this.img[0].src ="./static/sprites/pacman_animation.png"
		this.pacmanFrameCount = 4;
        
		this.img[1] = new Image()
		this.img[1].src ="./static/sprites/pacman_lose.png"
        this.animationFrameCount = 14;

        this.img[2] = new Image()
		this.img[2].src ="./static/sprites/fruit.png"
        this.fruitFrameCount = 8;
    }
}