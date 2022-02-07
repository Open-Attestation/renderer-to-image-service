import { fetchAndDecryptDocument } from "./index";
import { sampleCerts } from "../fixtures/online-samples";

const plainTextDoc = sampleCerts.find((c) => c.title.includes("Plaintext"));
const encryptedDoc = sampleCerts.find((c) => c.title.includes("Encrypted"));

it("should fetch a plaintext document from a url", async () => {
  const doc = await fetchAndDecryptDocument(plainTextDoc.q.payload.uri);
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
});

it("should fetch an encrypted document from a url", async () => {
  const doc = await fetchAndDecryptDocument(encryptedDoc.q.payload.uri, encryptedDoc.anchor.key);
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
});

it("should throw an error when key to encrypted document is not provided", async () => {
  await expect(fetchAndDecryptDocument(encryptedDoc.q.payload.uri)).rejects.toThrowErrorMatchingInlineSnapshot(
    `"[Unable to decrypt document] An encrypted document has been fetched without specifying the decrypting key. Refer to the docs on generating the correct query params here: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params"`
  );
});
