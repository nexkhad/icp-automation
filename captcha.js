// import { executablePath } from 'puppeteer';
// import puppeteer from 'puppeteer-extra';
// import { setTimeout } from 'timers/promises'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import {solveGCaptcha} from './solver.js'
// import { resolve } from 'path';
// puppeteer.use(StealthPlugin())

// async function run() {
//     console.time('hi')
//   const browser = await puppeteer.launch({
//         headless: false,
//         devtools: false,
//         args: [
//             "--start-maximized",
//             '--allow-external-pages',
//             '--allow-third-party-modules',
//             '--data-reduction-proxy-http-proxies',
//             '--disable-web-security',
//             '--enable-automation',
//             '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
//             '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
//             '--disable-cache',
//             '--disable-application-cache'
//         ],
//         executablePath: executablePath(),
//     });

//     const page = await browser.newPage();
//     await page.goto("https://smart.gdrfad.gov.ae/Public_Th/StatusInquiry_New.aspx")

//     const toEnglishBtn = await page.waitForSelector("#sub-header > div.container-fluid > div > div.col-md-12.col-lg-4.col-xl-4 > div.dda-sub-header__actions.float-end > div:nth-child(2) > a")
//     await toEnglishBtn.click()

//     await page.waitForNavigation({ waitUntil: 'networkidle2' })

//     // const goToFileRadio = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtrdFile')
//     // await goToFileRadio.click()

//     // await setTimeout(5000)
//     const applicationNumber = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtApplicationNumber_Input')
//     await applicationNumber.type('22420171583692')

//     const TransactionNumber = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtTransactionNumber_Input')
//     await TransactionNumber.type('2104754849')

//     // const nationalitySelector = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtcmbNationality')
//     // await nationalitySelector.select('1b442cdd-671a-4beb-b18b-340a7ff8ca1b')

//     const dateInput = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtPaymentDate_Input')
//     await dateInput.type('06-05-2024')

//    const res =  solveGCaptcha(page)

// if(!res === 'done'){
//     console.log("An error occurred while solving. Stopping the solver.:   -> ", res);
//     return new Error('An error occurred while solving. Stopping the solver.:', res);
// }

// await setTimeout(3000)
//     await page.evaluate(() => {

//         return new Promise((resolve) => {
//             const clickBtn = () => {
//                 const button = document.querySelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtbtnSearch')
//                 if(button){
//                   button.click()
//                   resolve('done')
//                 }else{
//                   setTimeout(clickBtn, 2000)
//                 }
//             }
//             clickBtn()
//         })
//     })

//     const data = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wttblApplicationResult > tbody > tr > td:nth-child(2) > div > span')
//     const text = await page.evaluate(el => el.textContent, data)
//     console.log(text);

//     if(!text.includes('Approved')){
//         return new Error('An error occurred while solving. Stopping the solver.:', res);
//     }
//     await page.goto('https://www.gdrfad.gov.ae/en/unified-number-inquiry-service', {
//         waitUntil: 'networkidle2',
//     })

//     const passportInput = await page.waitForSelector('#edit-passport-number')
//     await passportInput.type('R0297690')

//     const nationalitySelector = await page.waitForSelector('#edit-nationality')
//     await nationalitySelector.select('205')

//     //date
//     const dayInput = await page.waitForSelector('#edit-date-of-brith-day')
//     await dayInput.type('6')

//     const monthInput = await page.waitForSelector('#edit-date-of-brith-month')
//     await monthInput.select('3')

//     const yearInput = await page.waitForSelector('#edit-date-of-brith-year')
//     await yearInput.type('1999')

//     const maleRadio = await page.waitForSelector('#edit-gender-1')
//     const femaleRadio = await page.waitForSelector('#edit-gender-2')

//     const gender = 'male'

//     if(gender === 'male'){
//         await maleRadio.click()
//     }else{
//         await femaleRadio.click()
//     }

//     await solveGCaptcha(page)

//     const submitButton = await page.waitForSelector('#edit-actions-submit')
//     await submitButton.click()

//     // const submitButton = await page.waitForSelector('#EmaratechSG_Theme_wt17_block_wtMainContent_wt10_wtbtnSearch')
//     // await submitButton.click()

//     const dataDiv = await page.waitForSelector('ul.messages__list > li:nth-child(1) > b')
//     const dataText = await page.evaluate(el => el.textContent, dataDiv)
//     console.log(dataText);

//     await page.goto('https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity')

//     const visaRadio = await page.waitForSelector('#maincontent > ui-view > form > div > div > div.row > fieldset > div:nth-child(2) > fieldset > div.form-group.col-md-12.ng-scope > div > span:nth-child(2) > input')
//     await visaRadio.click()

//     const uidInput = await page.waitForSelector('input.ng-pristine:nth-child(2)')
//     await uidInput.type('186458745')

//     const icp_nationalitySelector = await page.waitForSelector('.input-group-addon > input:nth-child(1)')
//     await icp_nationalitySelector.type('205')

//     const icp_date_of_brith = await page.waitForSelector('input.ng-isolate-scope')
//     await icp_date_of_brith.type('06/03/1999')

//     await solveGCaptcha(page)

//     await setTimeout(3000)

//     const icp_submitButton = await page.waitForSelector('#maincontent > ui-view > form > div > div > div.row > fieldset > div:nth-child(7) > div.col-md-9 > div.col-md-12 > button')
//     await icp_submitButton.click()

//     const fileNo = await page.waitForSelector('xpath/html/body/div[2]/div[2]/ui-view/form/div/div/div[1]/fieldset/div[8]/uib-accordion/div/div[1]/div[1]/div[2]/div/div/div/table/tbody[1]/tr/td[2]')
//     const fileNoText = await page.evaluate(el => el[0].textContent, fileNo)
//     console.log(fileNoText);

//     console.timeEnd('hi')
// }

// await run()
// await run()

import { executablePath, Page } from "puppeteer";
import { setTimeout } from "timers/promises";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { solveGoogleCaptcha } from "./solver.js";
import chromium from "@sparticuz/chromium";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Mozilla/5.0 (compatible; MSIE 11.0; Windows; Windows NT 6.0; Win64; x64; en-US Trident/7.0)",
  "Mozilla/5.0 (U; Linux i644 ) Gecko/20100101 Firefox/70.8",
  "Mozilla/5.0 (compatible; MSIE 8.0; Windows; Windows NT 6.2; Trident/4.0)",
  "Mozilla/5.0 (Linux; U; Android 4.4.4; SM-E500L Build/KTU84P) AppleWebKit/537.16 (KHTML, like Gecko)  Chrome/51.0.1177.381 Mobile Safari/534.3",
  "Mozilla/5.0 (Windows; U; Windows NT 10.4; x64; en-US) AppleWebKit/600.6 (KHTML, like Gecko) Chrome/47.0.2021.140 Safari/533.3 Edge/11.55035",
  "Mozilla/5.0 (Linux; U; Android 4.3.1; HTC One 801s Build/JSS15J) AppleWebKit/603.27 (KHTML, like Gecko)  Chrome/50.0.2963.252 Mobile Safari/600.9",
  "Mozilla/5.0 (Linux; U; Linux i573 ; en-US) Gecko/20100101 Firefox/54.5",
  "Mozilla/5.0 (Windows NT 10.0;) AppleWebKit/536.30 (KHTML, like Gecko) Chrome/54.0.2841.266 Safari/601.0 Edge/9.94421",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 7_0_6; en-US) Gecko/20100101 Firefox/55.3",
  "Mozilla/5.0 (compatible; MSIE 9.0; Windows; Windows NT 6.1; x64 Trident/5.0)",
];

// Function to generate random number
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const launchDevConfig = {
  headless: false,
  devtools: false,
  defaultViewport: {
    height: 1080,
    width: 1920,
  },
  args: [
    "--start-maximized",
    "--allow-external-pages",
    "--allow-third-party-modules",
    "--data-reduction-proxy-http-proxies",
    "--disable-web-security",
    "--enable-automation",
    "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
    "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
    "--disable-cache",
    "--disable-application-cache",
  ],
};

const launchProdConfig = {
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
  ignoreHTTPSErrors: true,
};
export async function getDetails(passportNumber, passportExpiry) {
  const stealthBrowser = puppeteer.use(StealthPlugin);
  const browser = await stealthBrowser.launch(
    process.env.PRODUCTION ? launchProdConfig : launchDevConfig
  );
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgents[randomNumber(1, userAgents.length)]);
    await page.goto(
      "https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity",
      {
        waitUntil: "networkidle0",
      }
    );

    const passportBtn = await page.waitForSelector(
      '[name="selectIdentificater"]'
    );
    await passportBtn.click();

    console.log("clicking visa");
    const visaResidensyBtn = await page.waitForSelector(
      '[name="selectModule"][value="2"]'
    );
    await visaResidensyBtn.click();
    console.log("filling details");
    const passportNumberInput = await page.waitForSelector(
      '[name="passportNo"]'
    );
    await passportNumberInput.type(passportNumber);

    const passportExpiryInput = await page.waitForSelector(
      '[name="passportExpireDate"]'
    );
    await passportExpiryInput.type(passportExpiry);

    const countryCodeInput = await page.waitForSelector(
      ".input-group-addon > input:nth-child(1)"
    );
    await countryCodeInput.type("205");

    await setTimeout(3000);
    await solveGoogleCaptcha(page);

    const search = await page.waitForSelector(".btn-addon");
    await search.click();

    await setTimeout(3000);

    try {
      const isAvaliable = await page.waitForSelector('uib-accordion > div > div > :nth-child(2) > div > div > div:nth-child(1) > label.ng-binding', {
        timeout: 10000
      })
      
      if(!isAvaliable){
        console.log('not avaliable');
        await page.close()
        await browser.close()
       return {
         message: 'not avaliable'
       }
      }
    } catch (error) {
      await page.close()
      await browser.close()
      return {
        message: 'not avaliable'
      }
    }

    const fileName = await page.evaluate(() => {
      return document
        .querySelector(
          "uib-accordion > div > div > :nth-child(2) > div > div > div:nth-child(1) > label.ng-binding"
        )
        .innerText.replace(/[/ ]/g, "");
    });

    const uid = await page.evaluate(() => {
      return document
        .querySelector(
          "uib-accordion > div > div > :nth-child(2) > div > div > div:nth-child(2) > label.ng-binding"
        )
        .innerText.trim();
    });
    const status = await page.evaluate(() => {
      return document
        .querySelector(
          "uib-accordion > div > :nth-child(2) > :nth-child(2) > div > div:nth-child(1) > label.ng-binding"
        )
        .innerText.trim();
    });
    // const expiry = await page.evaluate(() => {
    //   return document
    //     .querySelector(
    //       "uib-accordion > div > :nth-child(2) > :nth-child(2) > div > div:nth-child(4) > label.ng-binding"
    //     )
    //     .innerText.trim();
    // });
    // const ldOfleaving = await page.evaluate(() => {
    //   return document
    //     .querySelector(
    //       "uib-accordion > div > :nth-child(2) > :nth-child(2) > div > div:nth-child(5) > label.ng-binding"
    //     )
    //     .innerText.trim();
    // });
    // const issueDate = await page.evaluate(() => {
    //   return document
    //     .querySelector(
    //       "uib-accordion > div > :nth-child(2) > :nth-child(2) > div > div:nth-child(2) > label.ng-binding"
    //     )
    //     .innerText.trim();
    // });

    let historyStatus = false;

    const oldFiles = await page.waitForSelector('[name="viewOldFiles"]');
    await oldFiles.click();

    const history = await page.$$(
      "uib-accordion > div > :nth-child(4) > :nth-child(2) > div > div > div > table > tbody > tr"
    );

    if (history.length) {
      historyStatus = true;
    }

      console.log(`
  fileId : ${fileName}
  uid:  ${uid}
  status: ${status}
  ${historyStatus ? "history available" : "history not available"}
    `);

    await page.close();
    await browser.close();

    return {
      fileName,
      uid,
      status,
      historyStatus,
    };

  } catch (error) {
    console.log(error);
    await browser.close();
  }
}
