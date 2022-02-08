import { NextApiRequest } from "next";
import { Record, String, ValidationError } from "runtypes";
import { ActionUrlQuery, ActionUrlAnchor } from "../types";

type QueryParams = {
  q: ActionUrlQuery;
  anchor?: ActionUrlAnchor;
};

const QueryParamsRecord = Record({
  q: Record({ payload: Record({ uri: String }) }),
  anchor: Record({ key: String }).optional(),
});

export const validateApiQueryParams = (query: NextApiRequest["query"]) => {
  try {
    const parsed = Object.keys(query).reduce((prev, curr) => {
      const currVal = query[curr];
      if (typeof currVal === "string") {
        return { [curr]: JSON.parse(currVal), ...prev };
      }
    }, {} as QueryParams);

    QueryParamsRecord.check(parsed);
    return parsed;
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new Error(
        `InvalidQueryParamsError: ${JSON.stringify(e.details)}` +
          `\n` +
          `Refer to the docs on generating the correct query params: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params`
      );
    } else {
      throw new Error(
        `InvalidQueryParamsError: Expected ?q={}&anchor={}, but was incompatible` +
          `\n` +
          `Refer to the docs on generating the correct query params: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params`
      );
    }
  }
};
