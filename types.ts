import { v2, v3 } from "@govtechsg/open-attestation";

// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
export interface ActionUrlQuery {
  payload: {
    uri: string;
    key?: string;
  };
}

// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
export interface ActionUrlAnchor {
  key: string;
}

export type V2OrV3WrappedDocument = v2.WrappedDocument | v3.WrappedDocument;

export type V2OrV3Document = v2.OpenAttestationDocument | v3.OpenAttestationDocument;
