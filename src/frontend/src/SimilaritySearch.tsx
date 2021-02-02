import Graphin from "@antv/graphin";
import { scaleLinear, scaleLog } from "d3-scale";
import React, { useCallback } from "react";
import getColorForGenre from "./colors";
import { Genre } from "./TrackGenrePrediction";
import useTracks from "./useTracks";
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
  const tracks = useTracks();
  const trackSimilarities = useTrackSimilarities(trackID);

  if (!trackID || !tracks || !trackSimilarities) return null;

  const distances = Object.values(trackSimilarities)
    .map((trackSimilarity) => trackSimilarity.all.distances)
    .flat();
  const nodes = Array.from(
    new Set(
      Object.keys(trackSimilarities).concat(
        Object.values(trackSimilarities)
          .map((trackSimilarity) => trackSimilarity.all.indices)
          .flat()
      )
    )
  );

  const rootGenre: Genre = tracks.find((track) => track.ID === trackID)
    ?.genre as Genre;
  const rootColor = getColorForGenre(rootGenre);
  const rootPopularity: number = tracks.find((track) => track.ID === trackID)
    ?.popularity;

  const minimumDistance = Math.min(...distances);
  const maximumDistance = Math.max(...distances);
  const thicknessScale = scaleLinear()
    .domain([minimumDistance, maximumDistance])
    .range([5, 1]);

  const minimumPopularity = Math.min(
    ...tracks.map((track) => track.popularity)
  );
  const maximumPopularity = Math.max(
    ...tracks.map((track) => track.popularity)
  );
  const popularityScale = scaleLog()
    .domain([minimumPopularity, maximumPopularity])
    .range([20, 40]);

  const data = {
    nodes: [
      {
        id: trackID.toString(),
        style: {
          keyshape: {
            fill: rootColor.fill,
            size: popularityScale(rootPopularity),
            stroke: rootColor.stroke,
          },
        },
      },
      ...nodes.map((id) => {
        const genre: Genre = tracks.find((track) => track.ID === id)
          ?.genre as Genre;
        const popularity: number = tracks.find((track) => track.ID === id)
          ?.popularity;
        const color = getColorForGenre(genre);

        return {
          id,
          style: {
            keyshape: {
              fill: color.fill,
              size: popularityScale(popularity),
              stroke: color.stroke,
            },
          },
        };
      }),
    ],
    edges: Object.keys(trackSimilarities)
      .map((id) => {
        const distances = trackSimilarities[id].all.distances;

        return trackSimilarities[id].all.indices.map((index, trackIndex) => {
          const distance = distances[trackIndex];
          const scaledDistance = thicknessScale(distance);

          return {
            source: id,
            style: {
              keyshape: {
                lineWidth: scaledDistance,
              },
              label: {
                value: scaledDistance.toFixed(2),
              },
            },
            target: index,
          };
        });
      })
      .flat(),
  };

  console.log(nodes.length);

  return (
    <Graphin
      data={data}
      defaultNode={{
        style: {
          keyshape: {
            fillOpacity: 1,
            strokeOpacity: 1,
          },
          label: {
            opacity: 0, // A hack, necessary to avoid the label appearing after a node is hovered.
            visible: false,
          },
        },
      }}
      layout={{
        minNodeSpacing: 20,
        type: "concentric",
      }}
      ref={graphin}
    />
  );
};

export default SimilaritySearch;
