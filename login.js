import { executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { setTimeout } from 'timers/promises'
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from "@sparticuz/chromium";
import WebSocket from 'ws';
import express from 'express';
import { config } from 'dotenv';
config();

const app = express();

puppeteer.use(StealthPlugin())
const ws = new WebSocket(process.env.WEBSOCKET_URL);

async function run() {
    const prodConfig = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      }

    const devConfig = {
        headless: false,
        devtools: false,
        args: [
            '--start-maximized',
            '--allow-external-pages',
            '--allow-third-party-modules',
            '--data-reduction-proxy-http-proxies',
            '--disable-web-security',
            '--enable-automation',
            '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
            '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
            '--disable-cache',
            '--disable-application-cache'
        ],
        ignoreHTTPSErrors: true,
        executablePath: executablePath(),
    }

    const browser = await puppeteer.launch(process.env.PROD ? prodConfig : devConfig);

    const page = await browser.newPage();
    await page.goto("https://dubaievisaservices.com/login.jsf")

    const userName = await page.waitForSelector('#j_username')
    await userName.type('visa@princesstourism.com')

    const password = await page.waitForSelector('#j_password')
    await password.type('Princess@123456')

    const submitBtn = await page.waitForSelector('p.login:nth-child(5) > input:nth-child(1)')
    await setTimeout(3000)
    await submitBtn.click()
    
    await setTimeout(10000)
    ws.send(JSON.stringify({type:"message",roomId:"655dcb29188a2e3bb689b5ea", message: "", messageType: "ENTER_OTP"}))
    let otpReceived = false;
console.log("Waiting for OTP");
    const otpPromise = new Promise((resolve, reject) => {
        ws.on('message', function incoming(data) {
            const datas = JSON.parse(data);
            if (datas.messageType == "OTP" && !otpReceived) {
                otpReceived = true;
                resolve(datas.message);
            }
        });
    });

    const otp = await otpPromise;
    const otpInput = await page.waitForSelector('#myform\\:passcode');
    await otpInput.type(otp);
}



ws.on('open', function open() {
    console.log('Connected to WebSocket server');
    
    ws.on('message', async function incoming(data) {
        const datas = JSON.parse(data);
        console.log('Received:', JSON.parse(data.toString()));

    if(datas.messageType == "LOGIN"){
        console.log("LOGIN");
        await run()

        ws.send(JSON.stringify({type:"message",roomId:"655dcb29188a2e3bb689b5ea", message: "", messageType: "SUCCESS"}))
    }
});

ws.on('close', function close() {
    console.log('Disconnected from WebSocket server');
});

ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});

// Send message to WebSocket server
ws.send(JSON.stringify({type:"joinRoom",roomId:"655dcb29188a2e3bb689b5ea"}));
ws.send(JSON.stringify({type:"message",roomId:"655dcb29188a2e3bb689b5ea", message: "fjaslkdfjasdf"}));

});



app.listen(4001, () => console.log('Server started on port 4000'));
