import { genQueryWithKeyInAnchor, genQueryWithKeyInParams } from "./index";
import { sampleCerts } from "../fixtures/online-samples";

const plainTextDoc = sampleCerts.find((c) => c.title.includes("Plaintext"));
const encryptedDoc = sampleCerts.find((c) => c.title.includes("Encrypted"));

describe(`${genQueryWithKeyInAnchor.name}()`, () => {
  it("should generate query params + key in anchor", async () => {
    const receivedQuery = genQueryWithKeyInAnchor(encryptedDoc.q, encryptedDoc.anchor);

    const expectedParams = new URLSearchParams({ q: JSON.stringify(encryptedDoc.q) }).toString();
    const expectedAnchor = encodeURIComponent(JSON.stringify(encryptedDoc.anchor));

    expect(receivedQuery).toStrictEqual(`?${expectedParams}#${expectedAnchor}`);
  });

  it("should generate query params + key in anchor even if key is in query", async () => {
    const keyInQuery = { ...encryptedDoc.q };
    keyInQuery.payload.key = encryptedDoc.anchor.key;

    const receivedQuery = genQueryWithKeyInAnchor(keyInQuery as any);

    const expectedParams = new URLSearchParams({ q: JSON.stringify(encryptedDoc.q) }).toString();
    const expectedAnchor = encodeURIComponent(JSON.stringify(encryptedDoc.anchor));

    expect(receivedQuery).toStrictEqual(`?${expectedParams}#${expectedAnchor}`);
  });

  it("should generate query params + no key in anchor", async () => {
    const receivedQuery = genQueryWithKeyInAnchor(plainTextDoc.q, plainTextDoc.anchor);

    const expectedParams = new URLSearchParams({ q: JSON.stringify({ ...plainTextDoc.q }) }).toString();

    expect(receivedQuery).toStrictEqual(`?${expectedParams}`);
  });
});

describe(`${genQueryWithKeyInParams.name}()`, () => {
  it("should generate query params (with key in query params too)", async () => {
    const receivedQuery = genQueryWithKeyInParams(encryptedDoc.q, encryptedDoc.anchor);

    const expectedParams = new URLSearchParams({
      q: JSON.stringify(encryptedDoc.q),
      anchor: JSON.stringify(encryptedDoc.anchor),
    }).toString();

    expect(receivedQuery).toStrictEqual(`?${expectedParams}`);
  });

  it("should generate query params (with no key in query params)", async () => {
    const receivedQuery = genQueryWithKeyInParams(plainTextDoc.q, plainTextDoc.anchor);

    const expectedParams = new URLSearchParams({ q: JSON.stringify(plainTextDoc.q) }).toString();

    expect(receivedQuery).toStrictEqual(`?${expectedParams}`);
  });
});
