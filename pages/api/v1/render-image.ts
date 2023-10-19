import { NextApiRequest, NextApiResponse } from "next";
import { ActionUrlAnchor, ActionUrlQuery } from "../../../types";
import { genQueryWithKeyInAnchor, validateApiQueryParams } from "../../../utils";
import { getPage } from "../../../utils/getPage";

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
      const { browser, page } = await getPage();

      try {
        await page.emulateMediaType(null);

        const queryAndAnchor = genQueryWithKeyInAnchor(q, anchor);
        const rendererUrl = RENDERER_URL + queryAndAnchor;
        await page.goto(rendererUrl, { waitUntil: "networkidle2" });

        const iframe = await page.$("iframe#iframe");
        const contentFrame = await iframe.contentFrame();
        await contentFrame.waitForSelector("#rendered-certificate", { visible: true });

        const frame = page.frames().find((f) => f.parentFrame()?.url() === rendererUrl);
        const frameHeight = await frame.$eval("html", (e) => e.scrollHeight);
        await page.$eval("iframe", (el, frameHeight) => (el.style.height = `${frameHeight}px`), frameHeight);

        const img = (await iframe.screenshot({ encoding: "base64" })) as string;
        const imgBuffer = Buffer.from(img, "base64");

        res.writeHead(200, { "Content-Type": "image/png", "Content-Length": imgBuffer.length });
        res.end(imgBuffer);
      } catch (e) {
        res.status(500).end(e instanceof Error ? e.message : `UnknownError: ${JSON.stringify(e)}`);
      } finally {
        await browser.close();
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} is not allowed`);
  }
};

export default renderImage;
