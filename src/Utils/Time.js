import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.startTime = Date.now()
        this.currentTime = this.startTime
        this.currentTimeSeconds = this.startTime * 0.001
        this.elapsedTime = 0
        this.deltaTime = 16
        this.deltaTimeSeconds = this.deltaTime * 0.001

        this.tick()
    }

    tick()
    {
        const newCurrentTime = Date.now()
        this.deltaTime = newCurrentTime - this.currentTime
        this.deltaTimeSeconds = this.deltaTime * 0.001
        this.currentTime = newCurrentTime
        this.currentTimeSeconds = this.currentTime * 0.001
        this.elapsedTime = this.currentTime - this.startTime

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
