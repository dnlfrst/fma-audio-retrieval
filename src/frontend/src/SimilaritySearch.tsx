import Graphin from "@antv/graphin";
import React from "react";
import useTrackSimilarities from "./useTrackSimilarities";

const SimilaritySearch = ({ trackID }: { trackID: string }) => {
  const trackSimilarities = useTrackSimilarities(trackID);

  if (!trackID || !trackSimilarities) return null;

  const data = {
    nodes: [
      {
        id: trackID.toString(),
      },
      ...trackSimilarities.indices.map((index) => {
        return {
          id: index.toString(),
        };
      }),
    ],
    edges: trackSimilarities.indices.map((index) => {
      return {
        source: trackID.toString(),
        target: index.toString(),
      };
    }),
  };

  return (
    <Graphin
      data={data}
      layout={{ minNodeSpacing: 100, sortBy: "degree", type: "concentric" }}
    />
  );
};

export default SimilaritySearch;
