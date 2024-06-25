import { launch } from 'puppeteer';
import fs from 'fs';
import { setTimeout } from 'timers/promises';

(async () => {
  // Function to get cookies from file
  const getCookies = () => {
    const cookiesString = fs.readFileSync('./danata.json');
    return JSON.parse(cookiesString);
  };

  // Launch browser
  const browser = await launch({
    headless: true,
    devtools: true,
    defaultViewport: {
      height: 1080,
      width: 1920,
    },
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
      '--disable-application-cache',
    ],
  });

  const page = await browser.newPage();
  
  // Set cookies
  const cookies = getCookies();
  await page.setCookie(...cookies);

  const targetUrl = 'https://www.dubaievisaservices.com/visa/newApplyVisa.jsf';

  while (true) {
    try {
      // Navigate to the target URL
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
      console.log('Page reloaded');

      // Wait for 5 minutes (300,000 milliseconds)
      await setTimeout(300000);
    } catch (error) {
      console.log('Error during page reload:', error);
    }
  }
})();

