import { Card, Table } from "antd";
import React from "react";
import useTracks from "./useTracks";

const trackListColumns = [
  {
    dataIndex: "ID",
    title: "ID",
  },
  {
    dataIndex: "title",
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
    dataIndex: "interest",
    title: "Popularity",
  },
];

const TrackList = () => {
  const tracks = useTracks();

  return (
    <Card style={{ width: "100%" }} title="Tracks">
      <Table
        columns={trackListColumns}
        dataSource={tracks}
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Card>
  );
};

export default TrackList;
