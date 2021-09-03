import Link from "next/link";
import Layout from "../components/Layout";
import { sampleCerts } from "../fixtures/online-samples";
import { genQueryWithKeyInAnchor, genQueryWithKeyInParams } from "../utils";

const IndexPage = () => (
  <Layout title="Renderer-to-Image Service">
    <h1 className="text-2xl mb-4">🏞 Renderer-to-Image Service</h1>

    <table className="table-auto w-100">
      <thead>
        <tr>
          <th className="border bg-gray-200">Type</th>
          <th className="border bg-gray-200">Render Preview</th>
          <th className="border bg-gray-200">
            Equivalent API Endpoint:
            <br />
            Renderer-to-Image
          </th>
        </tr>
      </thead>
      <tbody>
        {sampleCerts.map((e, i) => (
          <tr className="" key={i}>
            <td className="border px-4 py-2">{e.title}</td>
            <td className="border text-xs underline break-all px-4 py-2">
              <Link href={`/renderer${genQueryWithKeyInAnchor(e.q, e.anchor)}`}>{`/renderer${decodeURIComponent(
                genQueryWithKeyInAnchor(e.q, e.anchor)
              )}`}</Link>
            </td>
            <td className="border text-xs underline break-all px-4 py-2">
              <a
                href={`/api/v1/renderImage${genQueryWithKeyInParams(e.q, e.anchor)}`}
              >{`/api/v1/renderImage${decodeURIComponent(genQueryWithKeyInParams(e.q, e.anchor))}`}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

export default IndexPage;
