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
    anchor: { key: "691add1930798b63b17c8683a4776bedc16771ea5664337e21a563be0529024f" },
  },
  {
    title: "[Plaintext] PDT HealthCert v2.0",
    q: { payload: { uri: "https://schemata.openattestation.com/sg/gov/moh/pdt-healthcert/2.0/endorsed-wrapped.json" } },
  },
];
