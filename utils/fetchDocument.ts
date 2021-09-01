import { decryptString } from "@govtechsg/oa-encryption";
import { V2OrV3WrappedDocument } from "../types";

/**
 * Helper function to fetch and decode document (if key is present)
 * @param uri
 * @param key
 * @returns
 */
export const fetchAndDecryptDocument = async (uri: string, key?: string): Promise<V2OrV3WrappedDocument> => {
  return await fetch(uri)
    .then((res) => res.json())
    .then((obj) => ({ ...obj, key }))
    .then((doc) => (doc.key ? JSON.parse(decryptString(doc)) : doc));
};
