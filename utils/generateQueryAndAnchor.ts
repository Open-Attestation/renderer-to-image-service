import { ActionUrlQuery, ActionUrlAnchor } from "../types";

const stringifyAndEncode = (obj: any) => encodeURIComponent(JSON.stringify(obj));

export const generateQueryAndAnchor = (q: ActionUrlQuery, anchor?: ActionUrlAnchor) => {
  const action = stringifyAndEncode(q);
  const key = anchor ? `#${stringifyAndEncode(anchor)}` : ``;

  return "?q=" + action + key;
};
