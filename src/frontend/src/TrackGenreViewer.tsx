import { Area } from "@ant-design/charts";
import React from "react";
import useTrackGenrePredictions from "./useTrackGenrePredictions";
import Widget from "./Widget";

const TrackGenreViewer = ({ trackID }: { trackID: string }) => {
  const width = 450;

  const trackGenrePredictions = useTrackGenrePredictions(trackID);

  return (
    <Widget style={{ right: 75, width }} title="Track Genre Prediction">
      <Area
        data={trackGenrePredictions}
        isPercent={true}
        legend={{
          flipPage: false,
        }}
        padding={[80, 25, 50, 50]}
        seriesField="genre"
        xAxis={{
          title: {
            text: "Seconds",
          },
        }}
        xField="second"
        yAxis={{
          title: {
            text: "Probability",
          },
        }}
        yField="probability"
      />
    </Widget>
  );
};

export default TrackGenreViewer;
