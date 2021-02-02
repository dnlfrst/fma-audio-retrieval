import { Graph } from "@antv/g6";
import { scaleLinear, scaleLog } from "d3-scale";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import getColorForGenre from "./colors";
import { Genre } from "./TrackGenrePrediction";
import useTracks from "./useTracks";
import useTrackSimilarities from "./useTrackSimilarities";

const SimilaritySearch = ({
  height,
  setHoveredTrackID,
  setSelectedTrackID,
  trackID,
  width,
}: {
  height: number;
  setHoveredTrackID: Dispatch<SetStateAction<string>>;
  setSelectedTrackID: Dispatch<SetStateAction<string>>;
  trackID: string;
  width: number;
}) => {
  const [graph, setGraph] = useState<Graph>();
  const tracks = useTracks();
  const trackSimilarities = useTrackSimilarities(trackID);

  const container = useCallback(
    (element: HTMLDivElement) => {
      if (!trackID || !tracks || !trackSimilarities || !element) return;

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
      const rootPopularity: number = tracks.find(
        (track) => track.ID === trackID
      )?.popularity;

      const minimumDistance = Math.min(...distances);
      const maximumDistance = Math.max(...distances);
      const distanceScale = scaleLinear()
        .domain([minimumDistance, maximumDistance])
        .range([50, 100]);
      const thicknessScale = scaleLinear()
        .domain([minimumDistance, maximumDistance])
        .range([3, 0.5]);

      const minimumPopularity = Math.min(
        ...tracks.map((track) => track.popularity)
      );
      const maximumPopularity = Math.max(
        ...tracks.map((track) => track.popularity)
      );
      const popularityScale = scaleLog()
        .domain([minimumPopularity, maximumPopularity])
        .range([5, 10]);

      const data = {
        nodes: [
          {
            color: rootColor.fill,
            id: trackID.toString(),
            size: popularityScale(rootPopularity),
          },
          ...nodes.map((id) => {
            const genre: Genre = tracks.find((track) => track.ID === id)
              ?.genre as Genre;
            const popularity: number = tracks.find((track) => track.ID === id)
              ?.popularity;
            const color = getColorForGenre(genre);

            return {
              color: color.fill,
              id,
              size: popularityScale(popularity),
            };
          }),
        ],
        edges: Object.keys(trackSimilarities)
          .map((id) => {
            const distances = trackSimilarities[id].all.distances;

            return trackSimilarities[id].all.indices.map(
              (index, trackIndex) => {
                const distance = distances[trackIndex];
                const scaledThickness = thicknessScale(distance);

                return {
                  source: id,
                  style: {
                    lineWidth: scaledThickness,
                  },
                  target: index,
                };
              }
            );
          })
          .flat(),
      };

      if (graph) {
        graph.changeData(data);
      } else {
        const graph = new Graph({
          container: element,
          height,
          fitViewPadding: 250,
          layout: {
            type: "force",
          },
          modes: {
            default: ["drag-canvas", "zoom-canvas", "drag-node"],
          },
          width,
        });

        graph.on("node:click", (event) =>
          setSelectedTrackID(event.item.getID())
        );
        graph.on("node:mouseenter", (event) =>
          setHoveredTrackID(event.item.getID())
        );
        graph.on("node:mouseleave", () => setHoveredTrackID(undefined));

        graph.data(data);
        graph.render();

        setGraph(graph);
      }
    },
    [trackID, tracks, trackSimilarities]
  );

  return <div ref={container} style={{ height: "100%", width: "100%" }} />;
};

export default SimilaritySearch;
