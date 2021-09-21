import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { Record, String } from "runtypes";

import { ActionUrlAnchor, ActionUrlQuery } from "../../../types";
import { genQueryWithKeyInAnchor } from "../../../utils";

const { DEPLOY_URL, URL } = process.env; // Production
const DEFAULT_URL = "http://localhost:3000"; // Development
let RENDERER_URL = DEPLOY_URL || URL || DEFAULT_URL;
RENDERER_URL += "/renderer";

const ParamsRecord = Record({
  q: String,
  anchor: String.optional(),
});

const QRecord = Record({
  payload: Record({ uri: String }),
});

const AnchorRecord = Record({
  key: String,
});

const renderImage = async ({ method, query }: NextApiRequest, res: NextApiResponse) => {
  switch (method) {
    case "GET":
      const params = query as { [key: string]: string };
      let q: ActionUrlQuery, anchor: ActionUrlAnchor;

      /* Validation */
      try {
        ParamsRecord.check(params);
      } catch (e) {
        res.status(400).end(`Check query params: ${JSON.stringify(params)}.\n\n${e.toString()}`);
      }
      try {
        q = JSON.parse(params.q);
        QRecord.check(q);

        if (params.anchor) {
          anchor = JSON.parse(params.anchor);
          AnchorRecord.check(anchor);
        }
      } catch (e) {
        res.status(400).end(`${e.toString()}`);
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const queryAndAnchor = genQueryWithKeyInAnchor(q, anchor);
      const rendererUrl = RENDERER_URL + queryAndAnchor;
      await page.goto(rendererUrl, { waitUntil: "networkidle2" });

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
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} is not allowed`);
  }
};

export default renderImage;