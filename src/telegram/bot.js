// npm modules
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

// local modules
const { BotBase } = require("../bot")
const refs = require("../refs")

let bot = new Telegraf(refs.telegramToken)

class BotTelegram extends BotBase {
    constructor(database, botSchema) {
        super(database, botSchema, "telegram_id")

        this.flag = false
    }

    async start() {
        bot.catch(error => {
            console.error(error)
        })
        
        bot.launch().catch(reason=>{})
    }

    async contextTranslator(context) {
        let url, type, filePath

        if (context.message.photo) {
            const file = await context.telegram.getFile(context.message.photo[context.message.photo.length-1].file_id);

            type = "image"
            
            url = `https://api.telegram.org/file/bot${refs.telegramToken}/${file.file_path}`   
        }
        
        if (context.message.document) {
            const file = await context.telegram.getFile(context.message.document.file_id);
            
            type = context.message.document.mime_type

            filePath = `https://api.telegram.org/file/bot${refs.telegramToken}/${file.file_path}`   
        }

        return {
            ...context,
            ...(context?.message||{}),
            from: context.chat.id,
            filePath,
            url, type,
            bot: this,
        } // fileName, filePath, url, text
    }

    getChatId(aim) {
        return aim
    }

    getPhoto(data) {
        return { source: data.filePath, ...(data.data || []) }
    }

    getPhotoData(data) {
        return { caption: data.caption, ...(data.options || []) }
    }

    getDocument(data) {
        return data
    }

    async init() {}

    receiveCommand(command, callback) {
        super.receiveCommand(command, callback);
        bot.command(command, async ctx => await callback(await this.contextTranslator(ctx)))
    }

    receiveMessage(callback) {
        super.receiveMessage(callback);

        // const bot_ = this

        bot.on(message("text"), async ctx =>  {
            // if (bot_.flag)
            //     bot_.flag = false
            // else
                return await callback(await this.contextTranslator(ctx))
        })
    }

    sendMessage(aim, data) {
        return bot.telegram.sendMessage(this.getChatId(aim), data)
    }

    receivePhoto(callback) {
        super.receivePhoto(callback);

        const bot_ = this

        bot.on(message("photo"), async ctx => {
            // bot_.flag = true

            return await callback(await this.contextTranslator(ctx))
        })
    }

    sendPhoto(aim, data) {
        return bot.telegram.sendPhoto(this.getChatId(aim), this.getPhoto(data), this.getPhotoData(data))
    }

    receiveDocument(callback) {
        super.receiveDocument(callback);

        const bot_ = this

        bot.on(message("document"), async ctx => {
            // bot_.flag = true

            return await callback(await this.contextTranslator(ctx))
        })
    }

    sendDocument(aim, data) {
        return bot.telegram.sendDocument(this.getChatId(aim), this.getDocument(data))
    }
}

module.exports = { BotTelegram }