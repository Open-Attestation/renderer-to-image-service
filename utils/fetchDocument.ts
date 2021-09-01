import { decryptString } from "@govtechsg/oa-encryption";
import { v2, WrappedDocument } from "@govtechsg/open-attestation";
import sampleWrappedDocument from "../fixtures/sample-certificate-of-award.json";

/**
 * Helper function to fetch and decode document (if key is present)
 * @param uri
 * @param key
 * @returns
 */
export const fetchAndDecodeDocument = async (
  uri: string,
  key?: string
): Promise<WrappedDocument<v2.OpenAttestationDocument>> => {
  return await fetch(uri)
    .then((res) => res.json())
    .catch((e) => {
      // Fallback?
      console.error(`Failed to fetch ${uri}`, e);
      return sampleWrappedDocument;
    })
    .then((obj) => ({ ...obj, key }))
    .then((doc) => (doc.key ? decryptString(doc) : doc));
};
