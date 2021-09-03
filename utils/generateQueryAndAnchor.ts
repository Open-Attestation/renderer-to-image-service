import { ActionUrlQuery, ActionUrlAnchor } from "../types";

const stringifyAndEncode = (obj: any) => encodeURIComponent(JSON.stringify(obj));

export const genQueryWithKeyInAnchor = (q: ActionUrlQuery, anchor?: ActionUrlAnchor) => {
  const action = stringifyAndEncode(q);

  const key = anchor ? anchor.key : q.payload.key;
  const encodedKey = key ? `#${stringifyAndEncode({ key })}` : ``;

  return "?q=" + action + encodedKey;
};

export const genQueryWithKeyAsSearchParams = (q: ActionUrlQuery, anchor?: ActionUrlAnchor) => {
  const params = { q: JSON.stringify(q) };
  const searchParams = new URLSearchParams(params);

  const key = anchor ? anchor.key : q.payload.key;
  if (key) searchParams.append("anchor", JSON.stringify({ key }));

  return "?" + searchParams.toString();
};
