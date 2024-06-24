
// NPM Modules
const axios = require('axios')
const express = require('express')

// Local Modules
const { MySQL } = require('./src/db')
const { ExampleBot } = require('./src/schema/example')

// Bot Modules
const { BotTelegram } = require('./src/telegram/bot')

// Declaration of Important Variables
const app = express()
const port = process?.env?.PORT || 3000

const path = "Write the path of the endpoint."
const checkEndpoint = true

const db = new MySQL() // The database manager class
const schema = new ExampleBot(db) // The bot structure

const bots = { // Bot adapters
    "Telegram": new BotTelegram(db, schema),
}

const botKeys = Object.keys(bots)

// Start database before
db.initialize().then(() => {
    // Adapt and launch bots (for each adapters)
    for (const botKey of botKeys)
        bots[botKey].initialize().then(() => console.log(`${botKey} bot started with success.`)).catch(error => console.error(`${botKey} bot failed to start !`, error)) 
    
    // Start the update event
    update()
})

// Here It handles the update of the bot.
let updater

app.get('/', async (req, res) => {
    update()

    res.status(200).send("Update cycle made !")
})

function update() {
    if (updater)
        clearInterval(updater)

    updater = setInterval(async () => {
        for (const botKey of botKeys)
            await schema.update(bots[botKey])

        if (checkEndpoint)
            try {
                await axios.get(path)
            } catch (error) { console.log('Bot down!') }

    }, 2*60*1000)
}

// Start web server
app.listen(port, () => console.log(`Bot app listening on port ${port}!`))
