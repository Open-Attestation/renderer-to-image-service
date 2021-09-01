import { ActionUrlQuery, ActionUrlAnchor } from "../types";

export const sampleCerts: {
  title: string;
  q: ActionUrlQuery;
  anchor?: ActionUrlAnchor;
}[] = [
  {
    title: "[Plaintext] Certificate of Award",
    q: { payload: { uri: "https://gallery.openattestation.com/static/documents/certificate-of-award.opencert" } },
  },
  {
    title: "[Encrypted] OpenCerts Demo",
    q: { payload: { uri: "https://gallery.openattestation.com/static/documents/ropsten-encrypted.opencert" } },
    anchor: { key: "5b433c297f3b35690461b9ee08d77f3e8ee47ec86e5b8b1322b056da6f0b86c4" },
  },
];
