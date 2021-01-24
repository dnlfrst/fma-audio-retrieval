import { LoadingOutlined } from "@ant-design/icons";
import { Chart, registerInteraction } from "@antv/g2";
import { Card, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import tracksAsJSON from "./assets/tracks.json";

interface Track {
  ID: number;
  title: string;
  genre: string;
  duration: number;
  listens: number;
  interest: number;
}

const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const extractedTracks = [];

    for (const [trackID, track] of Object.entries(tracksAsJSON)) {
      extractedTracks.push({
        ...track,
        ID: trackID,
        date: new Date(track.date),
      });
    }

    setTracks(extractedTracks);
  }, []);

  return tracks;
};

const Explorer = () => {
  const tracks = useTracks();
  const tooltip = useRef<HTMLDivElement>();

  const container = useCallback(
    (element) => {
      if (!element) return;

      registerInteraction("drag-move", {
        start: [{ trigger: "plot:mousedown", action: "scale-translate:start" }],
        processing: [
          {
            trigger: "plot:mousemove",
            action: "scale-translate:translate",
            throttle: { wait: 25, leading: true, trailing: false },
          },
        ],
        end: [{ trigger: "plot:mouseup", action: "scale-translate:end" }],
      });

      const chart = new Chart({
        autoFit: true,
        container: element,
        height: 384,
        limitInPlot: true,
        padding: [25, 50, 120, 75],
        width: 768,
      });

      chart.data(tracks);
      chart.scale({
        date: { nice: true, type: "time" },
        interest: { nice: true, type: "pow" },
      });
      chart.axis("date", {
        title: {
          style: {
            fontStyle: "italic",
            fontWeight: "bold",
          },
          text: "Date of Release",
        },
      });
      chart.axis("interest", {
        title: {
          style: {
            fontStyle: "italic",
            fontWeight: "bold",
          },
          text: "Popularity",
        },
      });

      chart.point().position("date*interest").color("genre");
      chart.interaction("drag-move");
      chart.interaction("view-zoom");

      chart.legend({
        flipPage: false,
      });

      chart.render();
    },
    [tracks]
  );

  if (tracks.length > 0) {
    return (
      <>
        <Card
          style={{ width: "100%" }}
          title="Popularity of Genres through Time"
        >
          <div ref={container} />
        </Card>
        <div ref={tooltip} />
      </>
    );
  } else {
    return <Spin indicator={<LoadingOutlined />} />;
  }
};

export default Explorer;
