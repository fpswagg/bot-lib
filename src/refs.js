const axios = require('axios')
const fs = require("fs")

let refs = {
    // Constants
    digits: "0123456789",
    decimalDigits: "0123456789.",

    // Database References
    dbInfos: {
        host: "HOST",
        user: "USER",
        password: "PASSWORD",
        port: 3306,
        database: "DATABASE"
    },

    // Telegram References
    telegramToken: 'TELEGRAM BOT TOKEN',

    // Functions
    leaveNumbers: text => {
        let result = ""

        for (const char of text)
            if (refs.digits.includes(`${char}`))
                result += char

        return result
    },
    haveOnlyNumbers: text => (refs.leaveNumbers(text).length == text.length),

    leaveFloatNumbers: text => {
        let result = ""

        for (const char of text)
            if (refs.decimalDigits.includes(`${char}`))
                result += char

        return result
    },
    haveOnlyFloatNumbers: text => (refs.leaveFloatNumbers(text).length == text.length),
    isFloat: text => {
        if (refs.haveOnlyFloatNumbers(text))
            return !isNaN(parseFloat(text))

        return false
    },

    wait: time => new Promise((resolve, reject) => {
        try {
            setTimeout(resolve, time);
        } catch (error) {
            reject(error)
        }
    }),

    async checkImageUrl(url) {
        try {
            const response = await axios.head(url);
            const contentType = response.headers['content-type'];
    
            if (contentType && contentType.startsWith('image/')) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            // console.error('Error occurred while checking the URL:', error);
            return false;
        }
    },

    download(path, localFile) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: path,
                responseType: 'stream'
            }).then(response => {
                try {
                    fs.unlinkSync(localFile)
                } catch (error) {}
                
                const writer = fs.createWriteStream(localFile);
                
                response.data.pipe(writer);
    
                writer.on('finish', resolve);
                writer.on('error', reject);
            })
        })
    }

}

module.exports = refs