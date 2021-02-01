import { LoadingOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Space, Spin, Typography } from "antd";
import React from "react";
import useTracks from "./useTracks";
import Widget from "./Widget";

const { Text, Title } = Typography;

const TrackViewer = ({
  selectRandomTrack,
  trackID,
}: {
  selectRandomTrack: () => void;
  trackID: string;
}) => {
  const tracks = useTracks();

  const selectedTrack = tracks?.find((track) => track.ID === trackID);
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
          <Title ellipsis level={3}>
            {selectedTrack.title}
          </Title>
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
