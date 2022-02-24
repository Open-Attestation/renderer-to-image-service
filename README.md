# Renderer-to-Image Service

An API endpoint for users to obtain an image screenshot of their OpenAttestation document.

## Prerequisites

At a glance, only the following versions are supported:

- chrome-aws-lambda: v5.5.0
- Node: v12 and v14 (Lambda runtime and development respectively)

### chrome-aws-lambda - v5.5.0

Due to the [deployment package size limit of AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), deployed functions on Netlify needs to be <= 50MB. To get around this limitation, the `chrome-aws-lambda` dependency in [package.json](./package.json) has been pinned to v5.5.0 as it is [smaller in size](https://github.com/alixaxel/chrome-aws-lambda/issues/200#issuecomment-899603464).

### Develop/Build - Node v14

When developing or building the Next app, please use Node v14.

> Note: Node v16 does not work with the OpenAttestation library (@govtechsg/decentralized-renderer-react-components) due to an odd bug happening when the `npm run build` command is run.

### Deployed Lambda runtime for API functions - Node v12

When deploying the API functions to Netlify, please set runtime to Node v12 by setting the following environment variable in Netlify:

```text
AWS_LAMBDA_JS_RUNTIME=nodejs12.x
```

> Note: Node v12 is required because `chrome-aws-lambda` (Chromium) requires a shared library `libnss3.so` that seems to be missing in Node v14.

## Getting Started

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
https://renderer-to-image.netlify.app/api/v1/render-image?q=%7B%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgallery.openattestation.com%2Fstatic%2Fdocuments%2Ftranscript-encrypted.opencert%22%7D%7D&anchor=%7B%22key%22%3A%225b433c297f3b35690461b9ee08d77f3e8ee47ec86e5b8b1322b056da6f0b86c4%22%7D
```
