// NPM Modules

// Local Modules
const { Process } = require("../process")
const { BotSchema } = require("../bot-schema")

const refs = require("../refs")

class ExampleBot extends BotSchema {
    constructor(database, ...bots) {
        super(database, ...bots)

    }

    async initializeBot(bot) {
        bot.receiveCommand("start", data => this.commandMiddleware(data, this.startCallback, this))
        bot.receiveCommand("test", data => this.testCallback(data, this))
        
    }

    async updateBot(bot) {
        
    }

    // Middlewares
    async commandMiddleware(data, callback, schema = this, invalid = async () => false, invalidMessage = "Command is not available.") {
        const bot = data.bot
        const from = data.from

        if (await invalid())
            return await (async () => await bot.sendMessage(from, invalidMessage))()
            
        else 
            return await callback(data, schema)
        
    }
    
    // Callbacks
    async connectCallback(data, schema = this) {
        const bot = data.bot
        const from = data.from

        const database = schema.database
    
        await bot.sendMessage(from, "Process 1 started. Send me a text or image.")

        schema.startProcess(from, new Process(async ({text, type, url, filePath}, source, process) => {
            const path = url || filePath

            if (text) {
                return "Received text. Process 1 ended.\nProcess 2 Started. Send me anything."
            } else if (type.split("/")[0] == "image" && path) {
                return "Received image. Process 1 ended.\nProcess 2 Started. Send me anything."
            }

            process.repeat()
            process.repetitions++

            return "Redo process 1"
        }, async () => "Process 2 ended"), bot)
    }

    async testCallback(data, schema = this) {
        const bot = data.bot
        const from = data.from

        const database = schema.database
        
        await bot.sendMessage(from, "Hello !")
    }

}

module.exports = { ExampleBot }