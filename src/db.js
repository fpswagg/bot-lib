// Modules declaring
    // npm
let axios = require("axios"),
    mysql = require("mysql"),
    fs = require("fs");

    // local
let refs = require("./refs");

class MySQL {
    constructor() {
        this.connection = null
    }

    initialize() {
        return new Promise((resolve, reject) => {
            const conn = mysql.createConnection(refs.dbInfos)
            
            conn.connect(error => {
                if (error) {
                    console.log("Could not connect to db.")
                    reject(error)
                } else {
                    console.log('Connected with success.')
                    resolve()

                    this.connection = conn
                }
            });
        })
    }

    isConnected() {
        return this.connection && true
    }

    isInitialized() {
        return this.isConnected()
    }

    query(text, values = [], conn = this.connection) {
        return new Promise((resolve, reject) => {
            conn.query(text, values, (error, results) => {
                if (error)
                    console.log(error)
    
                console.log(text)
                console.log(values)
    
                if (error?.fatal)
                    reject(error)
                else
                    resolve(results)
            })
        })
    }

    async select(from, where = "1", values = []) {
        return Array.from(await this.query(`SELECT * FROM ${from} WHERE ${where}`, [...values]))
    }

    async update(from, attribute, to, where = "1", values = []) {
        return await this.query(`UPDATE ${from} SET ${attribute}=? WHERE ${where}`, [to, ...values])
    }

    async delete(from, where = "1", values = []) {
        return await this.query(`DELETE FROM ${from} WHERE ${where}`, [...values])
    }

    async insert(to, attributes = [], values = []) {
        return await this.query(`INSERT INTO ${to} (${attributes.join(", ")}) VALUES (${values.map(() => "?").join(", ")})`, [...values])
    }

    async has(from, attribute, value) {
        const [ value_ ] = await this.select(from, `${attribute}=?`, [value])

        return value_ && true
    }

    async hasAnd(from, attribute, value, attribute2, value2) {
        const [ value_ ] = await this.select(from, `${attribute}=? AND ${attribute2}=?`, [value, value2])

        return value_ && true
    }
}

module.exports = { MySQL }
