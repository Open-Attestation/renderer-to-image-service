import { ActionUrlQuery, ActionUrlAnchor } from "../types";

const stringifyAndEncode = (obj: any) => encodeURIComponent(JSON.stringify(obj));

export const genQueryWithKeyInAnchor = (q: ActionUrlQuery, anchor?: ActionUrlAnchor) => {
  const params = { q: JSON.stringify({ ...q, key: undefined }) };
  const searchParams = new URLSearchParams(params);

  const key = anchor ? anchor.key : q.payload?.key;
  const encodedKey = key ? `#${stringifyAndEncode({ key })}` : ``;

  return "?" + searchParams.toString() + encodedKey;
};

export const genQueryWithKeyInParams = (q: ActionUrlQuery, anchor?: ActionUrlAnchor) => {
  const params = { q: JSON.stringify({ ...q, key: undefined }) };
  const searchParams = new URLSearchParams(params);

  const key = anchor ? anchor.key : q.payload?.key;
  if (key) searchParams.append("anchor", JSON.stringify({ key }));

  return "?" + searchParams.toString();
};
