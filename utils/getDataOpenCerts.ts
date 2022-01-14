import { getData, utils } from "@govtechsg/open-attestation";
import { V2OrV3WrappedDocument } from "../types";

export const getDataV2OrV3 = (wrappedDocument: V2OrV3WrappedDocument) => {
  if (utils.isWrappedV2Document(wrappedDocument)) return getData(wrappedDocument);
  else if (utils.isWrappedV3Document(wrappedDocument)) return wrappedDocument;
  else {
    console.warn("Unknown V2 or V3 OA document type.");
    return wrappedDocument;
  }
};

export const getTemplateUrl = (wrappedDocument: V2OrV3WrappedDocument) => {
  if (utils.isWrappedV2Document(wrappedDocument)) {
    const documentData = getData(wrappedDocument);
    return typeof documentData.$template === "object" ? documentData.$template.url : "https://legacy.opencerts.io/";
  } else {
    return wrappedDocument.openAttestationMetadata.template?.url;
  }
};
