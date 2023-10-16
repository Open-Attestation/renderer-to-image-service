# Renderer-to-Image Service

> **Note**: This service is still in its experimental phase.

An API endpoint for users to obtain an image or PDF screenshot of their OpenAttestation document.

## Prerequisites

- Node - v18 (`lts/hydrogen`)
- puppeteer-core - v21.3.8
- @sparticuz/chromium - v117.0.0

### Versions must be matched correctly

Puppeteer ships with a preferred version of chromium. Refer to [installation instructions](https://github.com/Sparticuz/chromium#install) on how to match versions between both `puppeteer-core` and `@sparticuz/chromium`.

### Why these dependencies

Due to the [deployment package size limit of AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), deployed functions needs to be <= 50MB. To get around this limitation, lightweight dependencies such as `puppeteer-core` and `@sparticuz/chromium` are used.

## Getting Started

> **Note**: The deployed Netlify instance has a hard timeout at 10 seconds which is too little time for some renderers. As such, screenshoting of some OA documents may not work.

Try it out here: <https://renderer-to-image.netlify.app>

### Developing locally

```bash
npm i
npm run dev
```

### Available endpoints

> See following [section](#generating-your-query-params) on how to create `q` and `anchor`

- `/api/v2/render-image?q={}&anchor={}`
- `/api/v2/render-pdf?q={}&anchor={}`

### Generating your query params

The query params used in this API endpoint closely resembles the standards set out in [Universal Actions for OpenAttestation documents](https://github.com/Open-Attestation/adr/blob/master/universal_actions.md#universal-actions-for-open-attestation-documents) but with one caveat - the `#` anchor containing the key is now embedded as a query param called anchor. This is because actual `#` anchors do not get sent to the server-side.

As such, this API endpoint expects 2 query params:

```text
/api/v2/render-image?q={}&anchor={}
```

Decoded resource after **`?q=`**:

```json
{
  "payload": {
    "uri": "https://url-to-document.example.com"
  }
}
```

Decoded resource after **`&anchor=`**:

```json
{
  "key": "secret-key"
}
```

\*The `key` object is added as a query param because anchors do not get sent to the server-side.

**Final URL**:

```text
https://renderer-to-image.netlify.app/api/v1/render-image?q=%7B%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgallery.openattestation.com%2Fstatic%2Fdocuments%2Ftranscript-encrypted.opencert%22%7D%7D&anchor=%7B%22key%22%3A%22691add1930798b63b17c8683a4776bedc16771ea5664337e21a563be0529024f%22%7D
```
