import Graphin from "@antv/graphin";
import React, { useCallback } from "react";
import useTrackSimilarities from "./useTrackSimilarities";

const SimilaritySearch = ({
  setSelectedTrackID,
  trackID,
}: {
  setSelectedTrackID: (trackID: string) => void;
  trackID: string;
}) => {
  const graphin = useCallback(
    (graphin: Graphin) => {
      if (!graphin) return;

      const { graph } = graphin;

      graph.on("node:click", (event) => setSelectedTrackID(event.item.getID()));
    },
    [trackID]
  );
  const trackSimilarities = useTrackSimilarities(trackID);

  if (!trackID || !trackSimilarities) return null;

  const data = {
    nodes: [
      {
        id: trackID.toString(),
      },
      ...trackSimilarities.indices.map((index) => {
        return {
          id: index.toString().padStart(6, "0"),
        };
      }),
    ],
    edges: trackSimilarities.indices.map((index) => {
      return {
        source: trackID.toString(),
        target: index.toString().padStart(6, "0"),
      };
    }),
  };

  return (
    <Graphin
      data={data}
      layout={{ minNodeSpacing: 100, sortBy: "degree", type: "concentric" }}
      ref={graphin}
    />
  );
};

export default SimilaritySearch;
