async function connect() {
    const fs = require('fs')
    const puppeteer = require('puppeteer');
    const QRCode = require('qrcode')

    const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const browser = await puppeteer.launch(
        {
            headless: false,
        })
    const page = await browser.newPage()
    await page.goto('https://web.whatsapp.com/', {
        waitUntil: 'networkidle0',
        timeout: 0
    })
    //await delay(5000)

    let temp = ''

    let intervalID = setInterval(async () => {

        try {
            let qrData = await page.evaluate(async () => {
                let qr = document.querySelector('._19vUU') ? document.querySelector('._19vUU').attributes[2].value : false
                let side = document.querySelector('#side') ? true : false
                let button = document.querySelector(".Jht5u") ? '.Jht5u' : false
                return { qr, side, button }
            })

            if (qrData.qr && qrData.qr != temp && !qrData.side) {
                temp = qrData.qr
                let date = new Date()
                let [hour, minutes, seconds] = [
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ];
                console.log(`QR Code Atualizado \n ${hour}:${minutes}:${seconds}`,)
                QRCode.toString(qrData.qr, { type: 'terminal', small: true }, (err, url) => console.log(url))
            }

            if (qrData.button) {
                console.log('recarregando página')
                await page.click(qrData.button)
            }

            if (!qrData.qr && qrData.side) {
                console.log("Conectado")
                await delay(5000)
                //const user_data = localStorage
                //fs.writeFileSync("user_data.txt", JSON.stringify(user_data));
                clearInterval(intervalID)
            }

        } catch (err) {
            console.log(err)
        }

    }, 3000);
}

module.exports = connect