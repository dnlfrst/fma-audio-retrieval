import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";
import { Track } from "./Track";
import useTracks from "./useTracks";

const getTrackListColumns = (
  isPlaying: boolean,
  playingTrackID: number,
  setIsPlaying: (isPlaying: boolean) => void,
  setPlayingTrackID: (trackID: number) => void
): ColumnsType<Track> => [
  {
    dataIndex: "ID",
    sorter: (firstTrack: Track, secondTrack: Track) =>
      firstTrack.ID - secondTrack.ID,
    title: "ID",
  },
  {
    dataIndex: "title",
    ellipsis: true,
    sorter: (firstTrack: Track, secondTrack: Track) =>
      firstTrack.title.localeCompare(secondTrack.title),
    title: "Title",
  },
  {
    dataIndex: "genre",
    title: "Genre",
  },
  {
    dataIndex: "date",
    render: (releaseDate: Date) => <>{releaseDate.toLocaleDateString("en")}</>,
    title: "Release Date",
  },
  {
    dataIndex: "popularity",
    sorter: (firstTrack: Track, secondTrack: Track) =>
      firstTrack.popularity - secondTrack.popularity,
    title: "Popularity",
  },
  {
    align: "center",
    key: "action",
    render: (track: Track) => {
      return (
        <Button
          icon={
            playingTrackID === track.ID && isPlaying ? (
              <PauseCircleOutlined />
            ) : (
              <PlayCircleOutlined />
            )
          }
          onClick={() => {
            if (isPlaying) {
              if (playingTrackID === track.ID) {
                setIsPlaying(false);
              } else {
                setPlayingTrackID(track.ID);
              }
            } else {
              if (playingTrackID !== track.ID) {
                setPlayingTrackID(track.ID);
              }

              setIsPlaying(true);
            }
          }}
          shape="circle"
          type="primary"
        />
      );
    },
    title: "Playback",
  },
];

const TrackList = ({
  isPlaying,
  playingTrackID,
  setIsPlaying,
  setPlayingTrackID,
}: {
  isPlaying: boolean;
  playingTrackID: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlayingTrackID: (trackID: number) => void;
}) => {
  const tracks = useTracks();

  return (
    <Card style={{ gridArea: "trackList" }} title="Tracks">
      <Table
        columns={getTrackListColumns(
          isPlaying,
          playingTrackID,
          setIsPlaying,
          setPlayingTrackID
        )}
        dataSource={tracks}
        pagination={{ pageSize: 5 }}
        rowKey="ID"
        size="small"
      />
    </Card>
  );
};

export default TrackList;
