import { validateApiQueryParams } from "./validation";

const sampleReqQuery = {
  q: '{"payload":{"uri":"https://gallery.openattestation.com/static/documents/transcript-encrypted.opencert"}}',
  anchor: '{"key":"5b433c297f3b35690461b9ee08d77f3e8ee47ec86e5b8b1322b056da6f0b86c4"}',
};

describe("should not throw error on valid query params", () => {
  it("unencrypted (plaintext) document", () => {
    expect(() => {
      validateApiQueryParams({ q: sampleReqQuery.q });
    }).not.toThrow();
  });

  it("encrypted document", () => {
    expect(() => {
      validateApiQueryParams(sampleReqQuery);
    }).not.toThrow();
  });
});

describe("should throw error on invalid query params", () => {
  it("malformed q in query params", () => {
    expect(() => {
      validateApiQueryParams({ ...sampleReqQuery, q: '{"foo":"bar"}' });
    }).toThrowErrorMatchingInlineSnapshot(`
"InvalidQueryParamsError: {\\"q\\":{\\"payload\\":\\"Expected { uri: string; }, but was missing\\"}}
Refer to the docs on generating the correct query params: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params"
`);
  });

  it("malformed anchor in query params", () => {
    expect(() => {
      validateApiQueryParams({ ...sampleReqQuery, anchor: '{"foo":"bar"}' });
    }).toThrowErrorMatchingInlineSnapshot(`
"InvalidQueryParamsError: {\\"anchor\\":{\\"key\\":\\"Expected string, but was missing\\"}}
Refer to the docs on generating the correct query params: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params"
`);
  });

  it("malformed query params", () => {
    expect(() => {
      validateApiQueryParams({ q: "foo" });
    }).toThrowErrorMatchingInlineSnapshot(`
"InvalidQueryParamsError: Expected ?q={}&anchor={}, but was incompatible
Refer to the docs on generating the correct query params: https://github.com/Open-Attestation/renderer-to-image-service#generating-your-query-params"
`);
  });
});
