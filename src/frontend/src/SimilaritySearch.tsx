import G6, { Graph } from "@antv/g6";
import { scaleLinear } from "d3-scale";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import getColorForGenre from "./colors";
import { Track } from "./Track";
import { Genre } from "./TrackGenrePrediction";
import useTracks from "./useTracks";
import useTrackSimilarities from "./useTrackSimilarities";

G6.registerNode(
  "animated-node",
  {
    afterDraw(modelConfiguration, group) {
      const radius = (modelConfiguration.size as number) / 2;

      const background = group.addShape("circle", {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r: radius,
          fill: modelConfiguration.style.stroke,
          opacity: 0.75,
        },
        name: "background-circle",
      });
      group.sort(); // Move new shape to the background.

      background.animate(
        {
          r: radius + 10,
          opacity: 0.0,
        },
        {
          repeat: true,
          duration: 2000,
          easing: "easeCubic",
        }
      );
    },
  },
  "circle"
);

const SimilaritySearch = ({
  height,
  setDisplayedTracks,
  setHoveredTrackID,
  setSelectedTrackID,
  trackID,
  width,
}: {
  height: number;
  setDisplayedTracks: Dispatch<SetStateAction<Track[]>>;
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

      setDisplayedTracks(tracks.filter((track) => nodes.includes(track.ID)));

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
        .range([25, 50]);
      const thicknessScale = scaleLinear()
        .domain([minimumDistance, maximumDistance])
        .range([3.5, 0.5]);

      const minimumPopularity = Math.min(
        ...tracks
          .filter((track) => nodes.includes(track.ID))
          .map((track) => track.popularity)
      );
      const maximumPopularity = Math.max(
        ...tracks
          .filter((track) => nodes.includes(track.ID))
          .map((track) => track.popularity)
      );
      const popularityScale = scaleLinear()
        .domain([minimumPopularity, maximumPopularity])
        .range([5, 10]);

      const data = {
        nodes: [
          {
            id: trackID.toString(),
            size: popularityScale(rootPopularity),
            style: {
              fill: rootColor.fill,
              stroke: rootColor.stroke,
            },
            type: "animated-node",
          },
          ...nodes.map((id) => {
            const genre: Genre = tracks.find((track) => track.ID === id)
              ?.genre as Genre;
            const popularity: number = tracks.find((track) => track.ID === id)
              ?.popularity;
            const color = getColorForGenre(genre);

            return {
              id,
              size: popularityScale(popularity),
              style: {
                fill: color.fill,
                stroke: color.stroke,
              },
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
            linkDistance: (edge) => {
              const sourceID = edge.source.id;
              const targetID = edge.target.id;

              const targetIndex = trackSimilarities[
                sourceID
              ]?.all.indices.indexOf(targetID);

              return (
                distanceScale(
                  trackSimilarities[sourceID]?.all.distances[targetIndex]
                ) ?? 25
              );
            },
            type: "force",
          },
          modes: {
            default: [
              "activate-relations",
              "drag-canvas",
              "drag-node",
              "zoom-canvas",
            ],
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
