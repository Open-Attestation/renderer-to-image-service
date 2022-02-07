import axios from "axios";
import { validateSchema } from "@govtechsg/open-attestation";
import { decryptString } from "@govtechsg/oa-encryption";
import { V2OrV3WrappedDocument } from "../types";

/**
 * Helper function to fetch and decode document (if key is present)
 * @param uri
 * @param key
 * @returns
 */
export const fetchAndDecryptDocument = async (uri: string, key?: string): Promise<V2OrV3WrappedDocument> => {
  return await axios
    .get(uri)
    .then((res) => res.data)
    .then((obj) => decryptDoc(obj, key));
};

const decryptDoc = (doc, key?: string) => {
  // If encrypted document, check if key is provided
  if (doc["cipherText"] && !key) {
    throw new Error(
      `[Unable to decrypt document] An encrypted document has been fetched without specifying the decrypting key. Refer to the docs on generating the correct query params here: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params`
    );
  }
  // If encrypted document, decrypt it
  else if (doc["cipherText"] && key) {
    doc = JSON.parse(decryptString({ ...doc, key }));
  }

  // Check if valid OpenAttestation document
  if (!validateSchema(doc)) {
    throw new Error(
      `[Invalid OA document] An invalid OpenAttestation document has been fetched. Refer to the docs here: https://github.com/Open-Attestation/renderer-to-image-service`
    );
  }

  return doc;
};
