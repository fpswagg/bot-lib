// local modules
const { Process } = require("./process")
const refs = require("./refs")

class BotSchema {
    constructor(database, ...bots) {
        this.database = database
        this.bots = bots
    }

    startProcess(from, process, bot) {
        bot.setData(from, refs.processData, [process, 0])
    }

    currentProcess(from, bot) {
        return bot.getData(from, refs.processData)?bot.getData(from, refs.processData)[0]:null
    }

    inProcess(from, bot) {
        return this.currentProcess(from, bot) && true
    }

    async initialize(bot) {
        if (!bot)
            for (const botI of this.bots)
                await this.initialize(botI)
        else {
            await bot.init()
            
            await this.initializeBot(bot)

            bot.receivePhoto(data => this.receivePhotoHandler(bot, data.from, data.url, data))
            bot.receiveDocument(data => this.receiveDocumentHandler(bot, data.from, data.filePath, data))
            bot.receiveMessage(data => this.receiveMessageHandler(bot, data.from, data.text, data))
            
        }
    }

    async initializeBot(bot) {}

    async update(bot) {
        if (!bot)
            for (const botI of this.bots)
                await this.update(botI)
        else {
            await this.updateBot(bot)
        }
    }

    async updateBot(bot) {}

    async receiveHandler(bot, from, data) {
        if (this.inProcess(from, bot)) {
            let process = this.currentProcess(from, bot)

            if (!process.terminated) {
                let processInstance = await process.perform(data)

                if (processInstance)
                    await bot.sendMessage(from, processInstance)
            }

            if (process.terminated)
                this.startProcess(from, null, bot)
        }
    }

    async receiveMessageHandler(bot, from, message, messageObject) {
        await this.receiveHandler(bot, from, { text: message, data: messageObject })
    }

    async receivePhotoHandler(bot, from, imageURL, photoObject) {
        await this.receiveHandler(bot, from, { file: imageURL, type: 'image', data: photoObject})
    }

    async receiveDocumentHandler(bot, from, filePath, fileObject) {
        await this.receiveHandler(bot, from, { file: filePath, filePath, type: fileObject.type.split("/")[0], data: fileObject })
    }
    
}

module.exports = { BotSchema }
