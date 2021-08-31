import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { isActionOf } from "typesafe-actions";
import { getData, v2, WrappedDocument } from "@govtechsg/open-attestation";
import {
  FrameActions,
  HostActionsHandler,
  renderDocument,
  timeout,
  updateHeight,
} from "@govtechsg/decentralized-renderer-react-components";
import sampleWrappedDocument from "../fixtures/sample-pdt-pcr-healthcert.json";

/* Workaround for undefined window object: Dynamic import so FrameConnector will not load on server-side */
const FrameConnector = dynamic(
  () =>
    import("@govtechsg/decentralized-renderer-react-components").then(
      (m) => m.FrameConnector
    ),
  { ssr: false, loading: () => <p>This component will load on client-side.</p> }
);

const Renderer = (
  wrappedDocument: WrappedDocument<v2.OpenAttestationDocument>
) => {
  wrappedDocument =
    Object.keys(wrappedDocument).length === 0
      ? (sampleWrappedDocument as any)
      : wrappedDocument;

  const document = useMemo(() => getData(wrappedDocument), [wrappedDocument]);
  const source =
    typeof document.$template === "object"
      ? document.$template.url
      : document.$template;

  const [height, setHeight] = useState(0);

  const onConnected = useCallback(
    (toFrame: HostActionsHandler) => {
      toFrame(renderDocument({ document }));
    },
    [document]
  );

  const fromFrame = useCallback((action: FrameActions) => {
    if (isActionOf(updateHeight, action)) {
      setHeight(action.payload);
    } else if (isActionOf(timeout, action)) {
      console.error(
        `Connection timeout on renderer.\nPlease contact the administrator of ${source}.`
      );
    }
  }, []);

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
