import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { Record, String } from "runtypes";

import { ActionUrlAnchor, ActionUrlQuery } from "../../../types";
import { genQueryWithKeyInAnchor } from "../../../utils";

const RENDERER_URL = "http://localhost:3000/renderer"; // FIXME: Obtain from env variables

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

const waitForFrameAttached = (page: puppeteer.Page, url: string): Promise<puppeteer.Frame> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Unable to locate renderer iframe."));
    }, 30000);

    page.once("frameattached", () => {
      clearTimeout(timeout);
      const frame = page.frames().find((frame) => frame.url() === url);
      resolve(frame);
    });
  });
};

const waitForFrame = (page: puppeteer.Page, url: string) => {
  let fulfill: (frame: puppeteer.Frame) => void;

  const checkFrame = () => {
    const frame = page.frames().find((f) => f.url() === url);
    if (frame) fulfill(frame);
    else page.once("frameattached", checkFrame);
  };

  const promise = new Promise<puppeteer.Frame>((x) => (fulfill = x));
  checkFrame();
  return promise;
};
