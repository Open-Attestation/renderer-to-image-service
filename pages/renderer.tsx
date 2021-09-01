import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isActionOf } from "typesafe-actions";
import { getData, v2 } from "@govtechsg/open-attestation";
import {
  FrameActions,
  HostActionsHandler,
  renderDocument,
  updateHeight,
} from "@govtechsg/decentralized-renderer-react-components";
import { fetchAndDecodeDocument } from "../utils/fetchDocument";
import { ActionUrlAnchor, ActionUrlQuery } from "../types";

/* Workaround for undefined window object: Dynamic import so FrameConnector will not load on server-side */
const FrameConnector = dynamic(
  () => import("@govtechsg/decentralized-renderer-react-components").then((m) => m.FrameConnector),
  { ssr: false, loading: () => <p>This component will load on client-side.</p> }
);

const missingQueryError = (
  <>
    Please provide valid query params. See examples{" "}
    <Link href="/">
      <a className="text-blue-500">here</a>
    </Link>
    .
  </>
);

const Renderer = () => {
  const { query } = useRouter();
  const [error, setError] = useState(<></>);
  const [height, setHeight] = useState(0);
  const [document, setDocument] = useState<v2.OpenAttestationDocument>();
  const [source, setSource] = useState("");

  useEffect(() => {
    (async () => {
      const { q } = query as { q: string };

      if (!q) return setError(missingQueryError);

      const actionStr = decodeURIComponent(q);
      const anchorStr = decodeURIComponent(window.location.hash.substr(1));
      let action: ActionUrlQuery;
      let anchor: ActionUrlAnchor;

      try {
        action = actionStr ? JSON.parse(actionStr) : {};
        anchor = anchorStr ? JSON.parse(anchorStr) : {};
        // TODO: Validate that action is has required fields
      } catch (e) {
        console.error(e);
        return setError(<p>{e.toString()}</p>);
      }

      const wrappedDocument = await fetchAndDecodeDocument(action.payload.uri, anchor.key || action.payload.key);
      const document = getData(wrappedDocument);
      const source = typeof document.$template === "object" ? document.$template.url : document.$template;

      setDocument(document);
      setSource(source);
      setError(null);
    })();
  }, [query]);

  const onConnected = useCallback(
    (toFrame: HostActionsHandler) => {
      toFrame(renderDocument({ document }));
    },
    [document]
  );

  const fromFrame = useCallback((action: FrameActions) => {
    if (isActionOf(updateHeight, action)) {
      setHeight(action.payload);
    }
  }, []);

  if (error) return error;
  return (
    <FrameConnector
      style={{ height: `${height}px`, width: `100%`, border: 0 }}
      source={source}
      onConnected={onConnected}
      dispatch={fromFrame}
    />
  );
};

export default Renderer;
