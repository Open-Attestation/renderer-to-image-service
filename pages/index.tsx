import Link from "next/link";
import Layout from "../components/Layout";

const examples = [
  {
    title: "Plaintext document",
    uri: "%7B%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgallery.openattestation.com%2Fstatic%2Fdocuments%2Fcertificate-of-award.opencert%22%7D%7D",
  },
  {
    title: "Encrypted document",
    uri: "%7B%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fgallery.openattestation.com%2Fstatic%2Fdocuments%2Fropsten-encrypted.opencert%22%7D%7D#%7B%22key%22%3A%225b433c297f3b35690461b9ee08d77f3e8ee47ec86e5b8b1322b056da6f0b86c4%22%7D",
  },
];

const IndexPage = () => (
  <Layout title="Renderer to Image Service">
    <h1 className="text-2xl mb-4">🏞 Renderer to Image Service</h1>

    <table className="table-auto w-100">
      <thead>
        <tr>
          <th className="border bg-gray-200">Type</th>
          <th className="border bg-gray-200">Link</th>
        </tr>
      </thead>
      <tbody>
        {examples.map((e, i) => (
          <tr className="" key={i}>
            <td className="border px-4 py-2">{e.title}</td>
            <td className="border text-xs px-4 py-2">
              <Link href={`/renderer?q=${e.uri}`}>{`/renderer?q=${decodeURIComponent(e.uri)}`}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Layout>
);

export default IndexPage;
