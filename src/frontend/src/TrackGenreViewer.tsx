import { Area } from "@ant-design/charts";
import { Empty, Tag, Typography } from "antd";
import React from "react";
import getColorForGenre, { getGenreColors } from "./colors";
import { Genre } from "./TrackGenrePrediction";
import useTrackGenrePredictions from "./useTrackGenrePredictions";
import Widget from "./Widget";

const { Text } = Typography;

const TrackGenreViewer = ({
  playbackProgress,
  trackID,
}: {
  playbackProgress: number;
  trackID: string;
}) => {
  const trackGenrePredictions = useTrackGenrePredictions(trackID);
  const trackGenrePredictionsToDisplay = trackGenrePredictions?.filter(
    (prediction) => prediction.second <= playbackProgress
  );
  const predictedGenre = [...(trackGenrePredictionsToDisplay ?? [])]?.sort(
    (firstPrediction, secondPrediction) =>
      secondPrediction.second - firstPrediction.second ||
      secondPrediction.probability - firstPrediction.probability
  )[0]?.genre;

  let contents;

  if (trackGenrePredictionsToDisplay === undefined) {
    contents = (
      <Empty
        description={
          <Text type="secondary">
            There are no predictions available for the selected track.
          </Text>
        }
        image={<Text>😱</Text>}
        imageStyle={{ fontSize: "xx-large", height: "unset" }}
      />
    );
  } else {
    if (trackGenrePredictionsToDisplay.length === 0) {
      contents = (
        <Text type="secondary">
          Start the playback to see an animated
          <br />
          prediction of the track's genre.
        </Text>
      );
    } else {
      contents = (
        <Area
          color={getGenreColors()}
          data={trackGenrePredictionsToDisplay}
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
      );
    }
  }

  return (
    <Widget
      size="small"
      style={{
        right: 75,
        width: 450,
        ...(trackGenrePredictionsToDisplay?.length === 0
          ? { textAlign: "center" }
          : {}),
      }}
      title={
        predictedGenre ? (
          <>
            Predicted Genre:{" "}
            <Tag color={getColorForGenre(predictedGenre).fill as Genre}>
              {predictedGenre}
            </Tag>
          </>
        ) : (
          "Predicted Genre"
        )
      }
    >
      {contents}
    </Widget>
  );
};

export default TrackGenreViewer;
