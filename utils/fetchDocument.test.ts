import axios from "axios";
import { validateSchema } from "@govtechsg/open-attestation";
import { encryptString } from "@govtechsg/oa-encryption";
import { fetchAndDecryptDocument } from "./index";
import sampleCert from "../fixtures/sample-certificate-of-award.json";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

it("should fetch a plaintext document from a url", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: sampleCert });

  const doc = await fetchAndDecryptDocument("https://example.com");
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
  expect(validateSchema(doc)).toBe(true);
});

it("should fetch an encrypted document from a url", async () => {
  const { key, ...encryptedDoc } = encryptString(JSON.stringify(sampleCert));
  mockedAxios.get.mockResolvedValueOnce({ data: encryptedDoc });

  const doc = await fetchAndDecryptDocument("https://example.com", key);
  expect(Object.keys(doc)).toStrictEqual(["version", "data", "signature"]);
  expect(validateSchema(doc)).toBe(true);
});

it("should throw an error when key to encrypted document is not provided", async () => {
  const { key, ...encryptedDoc } = encryptString(JSON.stringify(sampleCert));
  mockedAxios.get.mockResolvedValueOnce({ data: encryptedDoc });

  await expect(fetchAndDecryptDocument("https://example.com")).rejects.toThrowErrorMatchingInlineSnapshot(
    `"[Unable to decrypt document] An encrypted document has been fetched without specifying the decrypting key. Refer to the docs on generating the correct query params here: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params"`
  );
});

it("should throw an error when an invalid OA document is provided", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: { foo: "bar" } });

  await expect(fetchAndDecryptDocument("https://example.com")).rejects.toThrowErrorMatchingInlineSnapshot(
    `"[Invalid OA document] An invalid OpenAttestation document has been fetched. Refer to the docs here: https://github.com/Open-Attestation/renderer-to-image-service"`
  );
});
