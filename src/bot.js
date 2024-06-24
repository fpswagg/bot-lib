class BotBase {
    constructor(database, botSchema, attribute) {
        this.database = database
        this.botSchema = botSchema
        this.attribute = attribute
        this.data = {}
    }

    setData(aim, type, value) {
        if (!this.data[type])
            this.data[type] = {}
        
        this.data[type][aim] = value
    }

    getData(aim, type) {
        if (!this.data[type])
            return null
        else
            return this.data[type][aim]
    }

    async initialize() {
        await this.botSchema.initialize(this)
        await this.start()
    }

    async start() {}

    // All receives have a asynchronous callback function with data
    // All sends have data and aim

    receiveCommand(command, callback) {
        Object.bind(this.botSchema, callback)
    }

    async init() {}

    receiveMessage(callback) {
        Object.bind(this.botSchema, callback)
    }

    async sendMessage(aim, data) {}

    receivePhoto(callback) {
        Object.bind(this.botSchema, callback)
    }
    
    async sendPhoto(aim, data) {}

    receiveDocument(callback) {
        Object.bind(this.botSchema, callback)
    }
    
    async sendDocument(aim, data) {}

////async showProducts() {}

}

module.exports = { BotBase }