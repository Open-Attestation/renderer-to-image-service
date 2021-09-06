# Renderer-to-Image Service

An API endpoint for users to obtain a image screenshot of their Open Attestation document.

## Getting Started

Try it out here: `https://example.com/api/v2/render-image?q={}&anchor={}` // TODO: Deploy on Netlify

### Generating your query params

The query params used in this API endpoint closely resembles the standards set out in this document: [Universal Actions for Open-Attestation Documents](https://github.com/Open-Attestation/adr/blob/master/universal_actions.md#universal-actions-for-open-attestation-documents)

With the exception of the `#` anchor which is now embedded as a query param called `anchor`. As such, this API endpoint expects 2 query params:

1. Decoded resource after `?q=`:

   ```json
   {
     "payload": {
       "uri": "https://url-to-document.example.com"
     }
   }
   ```

2. Decoded resource after `&anchor=`:

   ```json
   {
     "key": "secret-key"
   }
   ```

   \*The `key` object is added as a query param because anchors do not get sent to the server-side.
