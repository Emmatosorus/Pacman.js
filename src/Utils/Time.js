import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.startTime = Date.now()
        this.currentTime = this.startTime
        this.elapsedTime = 0
        this.deltaTime = 16

        this.tick()
    }

    tick()
    {
        const newCurrentTime = Date.now()
        this.deltaTime = newCurrentTime - this.currentTime
        this.deltaTimeSeconds = this.deltaTime * 0.001
        this.currentTime = newCurrentTime
        this.elapsedTime = this.currentTime - this.startTime

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
