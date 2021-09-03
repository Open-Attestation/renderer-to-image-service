import { fetchAndDecryptDocument } from "./index";
import { sampleCerts } from "../fixtures/online-samples";

const plainTextDoc = sampleCerts.find((c) => c.title.includes("Plaintext"));
const encryptedDoc = sampleCerts.find((c) => c.title.includes("Encrypted"));

it("should fetch a plaintext document from a url", async () => {
  const doc = await fetchAndDecryptDocument(plainTextDoc.q.payload.uri);
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
});

it("should fetch an encyrpted document from a url", async () => {
  const doc = await fetchAndDecryptDocument(encryptedDoc.q.payload.uri, encryptedDoc.anchor.key);
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
});
