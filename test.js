import { launch } from 'puppeteer';
import fs,{ writeFileSync } from 'fs';
import { setTimeout } from 'timers/promises'

(async () => {
  const browser = await launch({
    headless: false,
    devtools: false,
    defaultViewport:{
      height: 1080,
      width: 1920
    },
    args: [
        "--start-maximized",
        '--allow-external-pages',
        '--allow-third-party-modules',
        '--data-reduction-proxy-http-proxies',
        '--disable-web-security',
        '--enable-automation',
        '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
        '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
        '--disable-cache',
        '--disable-application-cache'
    ]});
  const page = await browser.newPage();

  // Navigate to login page
  await page.goto('https://ps.uci.edu/~franklin/doc/file_upload.html');

  const fileInput = await page.waitForSelector('body > form > input[type=file]:nth-child(1)');
  await fileInput.uploadFile('./Danata/public/files/passport-back.jpg');
  // Save cookies to a file
  // const cookies = await page.cookies();
  // writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
})();
