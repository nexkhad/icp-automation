import { Frame, launch, Page } from "puppeteer";
import fs, { writeFileSync } from "fs";
import { setTimeout } from "timers/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Agent } from "http";

// Function to get the full path of a file
const getFullPath = (relativePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, relativePath);
};
(async () => {
  const cookiesString = fs.readFileSync("./danata.json");
  const cookies = JSON.parse(cookiesString);

  const browser = await launch({
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
  });
  const page = await browser.newPage();

  await page.setCookie(...cookies);
  // Navigate to login page
  await page.goto("https://www.dubaievisaservices.com/visa/newApplyVisa.jsf", {
    waitUntil: "networkidle0",
  });

  // Wait for the login page to load

  // file upload
  /**
   * 
   * @param {Frame} page 
   */
  const fileUpload = async (page) => {
    try {
      const fn = getFullPath("./public/files/20240128_194107.jpg");
      console.log({ fn });
      const element = await page.waitForSelector("#PassengerId");
      await element.uploadFile(fn);
      await element.evaluate((upload) =>
        upload.dispatchEvent(new Event("change", { bubbles: true }))
      );

      const okButton = await page.waitForSelector(
        "body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled"
      );
      await okButton.click();
      console.log("photo uploaded");

      const uploaders = await page.$$(".file_upload");
      console.log("uploaders", uploaders);

      await uploaders[1].evaluate((upload) =>console.log(upload));
      const passportFront = getFullPath("./public/files/passport-front.jpg");

      await UploadFile(page, passportFront, uploaders[1]);
      const passportBack = getFullPath("./public/files/passport-back.jpg");
      await UploadFile(page, passportBack, uploaders[2]);

      // Ensure the page is ready, wait few min
      //   await page.waitForSelector('#PassengerId', { visible: true });
      //   console.log("PassengerId selector found");

      //   const [passportBackChooser] = await Promise.all([
      //   actualPage.waitForFileChooser(),
      //   page.evaluate(() => document.querySelector('#PassengerId').click()),
      // ]);

      // await passportBackChooser.accept(["./public/files/passport-back.jpg"]);
      // wait few min ok
      console.log("passport back uploaded");
      // Debugging: Check if the file is indeed uploaded
      // const uploadedFileName = await page.$eval('#upload', input => input.files[0]?.name);
      // console.log("Uploaded file name: ", uploadedFileName);

      // if (!uploadedFileName) {
      //   throw new Error("File was not uploaded correctly.");
      // }

      // Other uploads can be added here following the same pattern
    } catch (error) {
      console.log(error, "error in file upload");
    }
  };

  /**
   * 
   * @param {Frame} page 
   * @param {String} fileName 
   * @param {ElementHandle} uploadButton
   */
  const UploadFile = async (page, fileName, uploadButton) => {
    await uploadButton.evaluate((upload) =>upload.click());
    let EditorIframe = await page.waitForSelector(
      "crop-tool > div > iframe"
    );
    let EditorFrame = await EditorIframe.contentFrame();
    let Editor = await EditorFrame.waitForSelector('#file');
    await Editor.evaluate((upload) => console.log(upload));
    await Editor.uploadFile(fileName);

    const zoomOut = await EditorFrame.waitForSelector('body > div > main > div > div.toolbar > button:nth-child(4)')
    await zoomOut.click()
    await setTimeout(500)
    await zoomOut.click()
    await setTimeout(500)
    await zoomOut.click()

    const okButton = await EditorFrame.waitForSelector('body > div > header > div > nav > button.nav__button.nav__button--success')
    await okButton.click()

    const okButton2 = await EditorFrame.waitForSelector('body > div > header > div > nav > span')
    await okButton2.click()

    const swalOkButton = await page.waitForSelector(
      "body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled"
    );
    await swalOkButton.click();
    await setTimeout(3000)
  };

  /**
   *
   * @param {Page} page
   */
  const fillFirstForm = async (page) => {
    try {
      const supplierSelector = await page.waitForSelector("#mat-select-0");
      await supplierSelector.click();
      const supplier = await page.waitForSelector("#mat-option-3");
      await supplier.click();

      const visaTypeSelector = await page.waitForSelector("#mat-select-1");
      await visaTypeSelector.click();
      const visaType = await page.waitForSelector("#mat-option-226");
      await visaType.click();

      const visaPlanSelector = await page.waitForSelector("#mat-select-2");
      await visaPlanSelector.click();
      const visaPlan = await page.waitForSelector("#mat-option-229");
      await visaPlan.click();

      // const email = await page.waitForSelector("#emailid");
      // await email.type("email");

      const requester = await page.waitForSelector("#requester");
      await requester.type("requester");

      const nationalitySelector = await page.waitForSelector("#mat-select-3");
      await nationalitySelector.click();
      const nationality = await page.waitForSelector(
        "body > div > div.cdk-overlay-connected-position-bounding-box > div > div > :nth-child(85)"
      );
      await nationality.click();
      // const fistName = await page.waitForSelector("#firstName");
      // await fistName.type("firstName");
      // const lastName = await page.waitForSelector("#lastName");
      // await lastName.type("lastName");
      const dob = await page.waitForSelector("#birthDate");
      await dob.type("01-01-1990");
      // const nationtlity = await page.waitForSelector("#nationality");
      // await nationtlity.type("nationality");
      // const passportNumber = await page.waitForSelector("#passportNumber");
      // await passportNumber.type("passportNumber");
      // const passportExpiryDate = await page.waitForSelector("#passportExpiryDate");
      // await passportExpiryDate.type("2025-01-01");
      // const passportIssuingCountry = await page.waitForSelector("#passportIssuingCountry");
      // await passportIssuingCountry.type("passportIssuingCountry");
    } catch (error) {
      console.log(error, "error in fill first form");
    }
  };
  
  const selectOption = async (page, selector, optionIndex) => {
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, selector);
  await setTimeout(1000)
    await page.evaluate((optionIndex) => {
      document.querySelector(`[id^='cdk-overlay'] > div > :nth-child(${optionIndex})`).click();
    }, optionIndex);
    await setTimeout(1000)
  };


/**
 * 
 * @param {Frame} page 
 */
  const fillSecondForm = async (page) => {
    try {
      
        // Previous Nationality
        await selectOption(page, '[formcontrolname="previousNationality"]', 85);
      
        // Passport Type
        await selectOption(page, '[formcontrolname="passportType"]', 4);
      
        // Birth Country
        await selectOption(page, '[formcontrolname="birthCountry"]', 85);
      
        // Passport Issuing Government
        await selectOption(page, '[formcontrolname="passportIssuingGovernment"]', 85);

        // birth country
        await selectOption(page, '[formcontrolname="birthCountry"]', 85);
      
      await setTimeout(3000)
      //click next button
      await page.evaluate(() => {
        console.log(document.querySelector('#cdk-accordion-child-2 > div > form > div.butt.text-center > button'));
        document.querySelector('#cdk-accordion-child-2 > div > form > div.butt.text-center > button').click()
      })
    } catch (error) {
      console.log(error, "error in fill second form");
    }
  }

/**
 * 
 * @param {Frame} page 
 */
  const fillApplicantDetails = async (page) => {
    try {
      await page.waitForSelector('[formcontrolname="religion"]');
      await page.evaluate(() => {
        document.querySelector('[formcontrolname="religion"]').click()
      })
    //  const religionSelect = await page.waitForSelector('[formcontrolname="religion"]');
    //   await religionSelect.click();
      // const religion = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(8)")
      // await religion.click();
      await selectOption(page, '[formcontrolname="religion"]', 8);
      // const faithSelect = await page.waitForSelector('[formcontrolname="faith"]');
      // await faithSelect.click();
      // const faith = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(6)")
      // await faith.click();
      await selectOption(page, '[formcontrolname="faith"]', 6);

      // const maritalStatusSelect = await page.waitForSelector('[formcontrolname="maritalStatus"]');
      // await maritalStatusSelect.click();
      // const maritalStatus = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(5)")
      // await maritalStatus.click();

      await selectOption(page, '[formcontrolname="maritalStatus"]', 5);

      // const educationLevelSelect = await page.waitForSelector('[formcontrolname="education"]');
      // await educationLevelSelect.click();
      // const educationLevel = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(5)")
      // await educationLevel.click();

      await selectOption(page, '[formcontrolname="education"]', 5);

      const professionSelect = await page.waitForSelector('[formcontrolname="profession"]');
      await professionSelect.type("software engineer");
      await setTimeout(2000)
      const profession = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(1)")
      await profession.click();


      // const languageSelect = await page.waitForSelector('[formcontrolname="language"]');
      // await languageSelect.click();
      // const language = await page.waitForSelector("[id^='cdk-overlay'] > div > :nth-child(5)")
      // await language.click();

      await selectOption(page, '[formcontrolname="languangeSpoken"]', 5);

      //Coming from country
      await selectOption(page, '[formcontrolname="comingFromCountry"]', 85);


      await page.evaluate(() => {
        document.querySelector('#cdk-accordion-child-3 > div > form > div.butt.text-center > button').click()
      })
    } catch (error) {
      console.log(error, "error in fill applicant details");
    }
  };


  const fillContactDetails = async (page) => {
      // Fill the Address Line 1
  await page.waitForSelector('input[formcontrolname="addressLine1"]');
  await page.type('input[formcontrolname="addressLine1"]', '123 MAIN ST');

  // Fill the Address Line 2
  await page.waitForSelector('input[formcontrolname="addressLine2"]');
  await page.type('input[formcontrolname="addressLine2"]', 'APT 4B');

  // Fill the City
  await page.waitForSelector('input[formcontrolname="city"]');
  await page.type('input[formcontrolname="city"]', 'NEW YORK');

  // Fill the Telephone
  await page.waitForSelector('input[formcontrolname="telephone"]');
  await page.type('input[formcontrolname="telephone"]', '1234567890');

  // Select Applicant Location Outside UAE
  await selectOption(page, '[formcontrolname="locationOutUAE"]', 4);
  // Adjust the selector based on the options

  // // Select Applicant Location Inside UAE
  await selectOption(page, '[formcontrolname="locationInUAE"]', 3);

  // // Select Applicant City Inside UAE
  await selectOption(page, '[formcontrolname="cityOutUAE"]', 2);

  // // Select Applicant Area Inside UAE
  await selectOption(page, '[formcontrolname="areaInUAE"]', 2);
  //smslang
  await selectOption(page, '[formcontrolname="smsLang"]', 1);

  }

  const firstFormIframe = await page.waitForSelector(
    "#contentSection > iframe"
  );
  let frame = await firstFormIframe.contentFrame();
  let nextBtn = await frame.waitForSelector(
    "#cdk-accordion-child-0 > div > form > div.butt.text-center > button"
  );

  await fillFirstForm(frame);
  await nextBtn.click();

  const fileFormIframe = await page.waitForSelector("#contentSection > iframe");
  const fileIFrame = await fileFormIframe.contentFrame();
  await setTimeout(3000);
  await fileUpload(fileIFrame, page);
  nextBtn = await fileIFrame.waitForSelector(
    '#cdk-accordion-child-1 > div > form > div.btn-align > button'
  )
  await nextBtn.click();
  await fillSecondForm(frame)
  await fillApplicantDetails(frame);
  await setTimeout(3000);
  await fillContactDetails(frame);

})();
