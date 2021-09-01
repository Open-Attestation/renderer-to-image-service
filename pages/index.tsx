import Link from "next/link";
import Layout from "../components/Layout";
import { sampleCerts } from "../fixtures/online-samples";
import { generateQueryAndAnchor } from "../utils";

const IndexPage = () => (
  <Layout title="Renderer-to-Image Service">
    <h1 className="text-2xl mb-4">🏞 Renderer-to-Image Service</h1>

    <table className="table-auto w-100">
      <thead>
        <tr>
          <th className="border bg-gray-200">Type</th>
          <th className="border bg-gray-200">Link</th>
        </tr>
      </thead>
      <tbody>
        {sampleCerts.map((e, i) => (
          <tr className="" key={i}>
            <td className="border px-4 py-2">{e.title}</td>
            <td className="border text-xs underline break-all px-4 py-2">
              <Link href={`/renderer${generateQueryAndAnchor(e.q, e.anchor)}`}>{`/renderer?q=${JSON.stringify(e.q)}${
                e.anchor ? "#" + JSON.stringify(e.anchor) : ""
              }`}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

export default IndexPage;
