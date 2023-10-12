import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import axios, { isAxiosError } from "axios";

const HEADERS_TO_REMOVE = ["x-frame-options", "content-security-policy", "access-control-allow-origin"];

export const getPage = async () => {
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--disable-web-security"],
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  await page.setBypassCSP(true);
  await page.setRequestInterception(true);

  page.on("request", async (request) => {
    try {
      const response = await axios({
        url: request.url(),
        responseType: "arraybuffer",
        method: request.method(),
        data: request.postData(),
        headers: request.headers(),
        maxRedirects: 20,
      });

      const resultHeaders = {};
      for (const [key, value] of Object.entries(response.headers)) {
        if (!HEADERS_TO_REMOVE.includes(key.toLocaleLowerCase())) {
          resultHeaders[key] = value;
        }
      }

      await request.respond({
        body: Buffer.from(response.data, "binary"),
        headers: resultHeaders,
        status: response.status,
      });
    } catch (e) {
      if (isAxiosError(e))
        await request.respond({
          body: Buffer.from(e.response.data, "binary"),
          headers: e.response.headers,
          status: e.status,
        });
      else console.error("Error while modifying response in Puppeteer (i.e. disabling CSP)", e);
    }
  });

  return { browser, page };
};
