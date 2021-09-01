// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md

export interface ActionUrlQuery {
  payload: {
    uri: string;
    key?: string;
  };
}

export interface ActionUrlAnchor {
  key?: string;
}
