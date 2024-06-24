class Process {
    /* 
        The callbacks have two parameters (data, source) and a return string or null
    */
    constructor(...callbacks) {
        // const process = this

        this.callbacks = callbacks//.map(callback => callback.bind(process))
        this.terminated = false
        this.repetitions = 0
        this.previous = null

        this.answering = false

        this._i = 0

        this.data = {}
    }

    repeat(i = 1) {
        // if (this._i)
        this._i -= i

        // console.log("repeat", this._i, this.callbacks.length)

        this.terminated = false
        this.repetitions++
        
    }

    continue(...callbacks) {
        const process = this

        if (callbacks.length > 0) {
            while (this.callbacks.length > this._i)
                this.callbacks.pop()

            this.callbacks.push(...callbacks/*.map(callback => callback.bind(process))*/)
        }

        this.terminated = false
    }

    async perform(data, source) {
        const process = this

        this._i++

        if (this._i >= this.callbacks.length)
            this.terminated = true
        
        while (this._i >= this.callbacks.length+1)
            this._i--

        return this.previous = await this.callbacks[this._i-1](data, source, process)
    }
}

module.exports = { Process }