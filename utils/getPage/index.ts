import chromium from "chrome-aws-lambda";
import { Page } from "puppeteer";

let page: Page;

export const getPage = async () => {
  if (page) return page;

  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });
  page = await browser.newPage();

  return page;
};
