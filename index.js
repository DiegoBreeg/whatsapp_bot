const { server } = require('./server/server.js')
const wp_bot = require('./wp_bot/exports.js')




async function main() {
    await wp_bot.connect()
}


main()

