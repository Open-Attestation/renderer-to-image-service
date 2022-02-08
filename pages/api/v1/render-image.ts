import { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import { ActionUrlAnchor, ActionUrlQuery } from "../../../types";
import { genQueryWithKeyInAnchor, validateApiQueryParams } from "../../../utils";

const TIMEOUT_IN_MS = 9 * 1000; // Netlify's execution limit is 10 secs (https://docs.netlify.com/functions/overview/#default-deployment-options)
const DEPLOY_URL = process.env.deployUrl; // Production (See next.config.js file)
const DEFAULT_URL = "http://localhost:3000"; // Development
let RENDERER_URL = DEPLOY_URL || DEFAULT_URL;
RENDERER_URL += "/renderer";

const renderImage = async ({ method, query }: NextApiRequest, res: NextApiResponse) => {
  switch (method) {
    case "GET":
      let q: ActionUrlQuery, anchor: ActionUrlAnchor;
      /* Validation */
      try {
        ({ q, anchor } = validateApiQueryParams(query));
      } catch (e) {
        res.status(400).end(e instanceof Error ? e.message : `UnknownError: ${JSON.stringify(e)}`);
        break;
      }

      /* Image capture using Puppeteer */
      try {
        const browser = await chromium.puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: true,
        });
        const page = await browser.newPage();

        const queryAndAnchor = genQueryWithKeyInAnchor(q, anchor);
        const rendererUrl = RENDERER_URL + queryAndAnchor;
        await page.goto(rendererUrl, { waitUntil: "networkidle2", timeout: TIMEOUT_IN_MS });

        const iframe = page
          .frames()
          // Find inner frame that has a parentFrame.url of rendererUrl
          .find((f) => f.parentFrame()?.url() === rendererUrl);
        const cert = await iframe.$("#rendered-certificate");
        const img = (await cert.screenshot({ encoding: "base64" })) as string;
        const imgBuffer = Buffer.from(img, "base64");

        await browser.close();

        res.writeHead(200, { "Content-Type": "image/png", "Content-Length": imgBuffer.length });
        res.end(imgBuffer);
      } catch (e) {
        res.status(500).end(e instanceof Error ? e.message : `UnknownError: ${JSON.stringify(e)}`);
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} is not allowed`);
  }
};

export default renderImage;
