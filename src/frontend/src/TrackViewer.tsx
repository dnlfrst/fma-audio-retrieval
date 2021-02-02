import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Rate, Space, Spin, Tag, Typography } from "antd";
import { ScaleLinear, scaleLinear } from "d3-scale";
import React from "react";
import styled from "styled-components";
import getColorForGenre from "./colors";
import { Track } from "./Track";
import { Genre } from "./TrackGenrePrediction";
import Widget from "./Widget";

const { Text, Title } = Typography;

const AttributedTitle = styled(Title)`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const CompactRating = styled(Rate)`
  margin: 0 !important;

  li {
    margin: 0 !important;
    padding: 0 !important;
    top: -1px;
  }
`;

const FlexibleContainer = styled.div`
  align-items: center;
  display: flex;
`;

const TrackViewer = ({
  displayedTracks,
  selectRandomTrack,
  trackID,
}: {
  displayedTracks: Track[];
  selectRandomTrack: () => void;
  trackID: string;
}) => {
  let popularityScale: ScaleLinear<number, number>;
  if (displayedTracks) {
    const minimumPopularity = Math.min(
      ...displayedTracks.map((track) => track.popularity)
    );
    const maximumPopularity = Math.max(
      ...displayedTracks.map((track) => track.popularity)
    );
    popularityScale = scaleLinear()
      .domain([minimumPopularity, maximumPopularity])
      .range([0, 5]);
  }

  const selectedTrack = displayedTracks?.find((track) => track.ID === trackID);
  const width = 450;
  const widthWithoutPadding = width - 2 * 24;

  return (
    <Widget
      style={{ left: 75, width }}
      title={
        <Space>
          Track
          <Button
            icon={<SwapOutlined />}
            onClick={selectRandomTrack}
            size="small"
            type="text"
          />
        </Space>
      }
    >
      {selectedTrack ? (
        <>
          <AttributedTitle level={3}>
            <Text ellipsis style={{ maxWidth: widthWithoutPadding * (3 / 7) }}>
              {selectedTrack.title}
            </Text>
            <FlexibleContainer>
              {selectedTrack.genre ? (
                <Tag
                  color={getColorForGenre(selectedTrack.genre as Genre).fill}
                >
                  {selectedTrack.genre}
                </Tag>
              ) : null}
              {selectedTrack.popularity !== undefined && popularityScale ? (
                <CompactRating
                  disabled
                  value={popularityScale(selectedTrack.popularity)}
                />
              ) : null}
            </FlexibleContainer>
          </AttributedTitle>
          <Text
            ellipsis
            style={{ maxWidth: widthWithoutPadding }}
            type="secondary"
          >
            by{" "}
            <Text strong type="secondary">
              {selectedTrack.artist}
            </Text>
          </Text>
          <br />
          <Text
            ellipsis
            style={{ maxWidth: widthWithoutPadding }}
            type="secondary"
          >
            in{" "}
            <Text strong type="secondary">
              {selectedTrack.album}
            </Text>
          </Text>
        </>
      ) : (
        <Spin indicator={<LoadingOutlined />} />
      )}
    </Widget>
  );
};

export default TrackViewer;
