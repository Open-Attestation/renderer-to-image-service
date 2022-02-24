import { ActionUrlQuery, ActionUrlAnchor } from "../types";

export const sampleCerts: {
  title: string;
  q: ActionUrlQuery;
  anchor?: ActionUrlAnchor;
}[] = [
  {
    title: "[Plaintext] OpenCerts Certificate of Award Demo",
    q: { payload: { uri: "https://gallery.openattestation.com/static/documents/certificate-of-award.opencert" } },
  },
  {
    title: "[Encrypted] OpenCerts Demo",
    q: { payload: { uri: "https://gallery.openattestation.com/static/documents/transcript-encrypted.opencert" } },
    anchor: { key: "5b433c297f3b35690461b9ee08d77f3e8ee47ec86e5b8b1322b056da6f0b86c4" },
  },
  {
    title: "[Plaintext] PDT HealthCert v2.0",
    q: { payload: { uri: "https://schemata.openattestation.com/sg/gov/moh/pdt-healthcert/2.0/endorsed-wrapped.json" } },
  },
  {
    title: "[Encrypted] PDT HealthCert v2.0",
    q: {
      payload: { uri: "https://api-vaccine.storage.staging.notarise.io/document/44409930-70b6-4ab7-94be-86cf57c9ed87" },
    },
    anchor: { key: "52ae6dafd2ce6f818ccb7d893f4fb58416453f42c4624a9c6a98abf0760f2119" },
  },
];
