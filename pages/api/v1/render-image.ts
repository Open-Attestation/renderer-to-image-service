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
        const iframeBoundingBox = await iframe.boundingBox();
        const contentFrame = await iframe.contentFrame();
        await contentFrame.waitForSelector("#rendered-certificate", { visible: true });
        const cert = await contentFrame.$("#rendered-certificate");

        await page.mouse.wheel({ deltaY: 200000 });
        await page.mouse.wheel({ deltaY: 200000 });
        await sleep(1000);
        const viewPort = await page.viewport();
        const certBoundingBox = await cert.boundingBox();
        const newIframeHeight = viewPort.height + Math.abs(certBoundingBox.y);
        await page.evaluate(() => {
          window.scrollTo({
            top: 0,
          });
        });

        page.addStyleTag({
          content: `iframe { height: ${Math.max(newIframeHeight, iframeBoundingBox.height)}px!important; }`,
        });

        const img = (await iframe.screenshot({
          encoding: "base64",
        })) as string;
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

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, time);
  });
}
