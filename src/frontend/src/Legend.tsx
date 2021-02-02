import { Col, Row, Tag } from "antd";
import React from "react";
import styled from "styled-components";
import getColorForGenre from "./colors";
import { Genre } from "./TrackGenrePrediction";
import Widget from "./Widget";

const FlexibleWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 0.5em;
`;

const Legend = () => {
  return (
    <Widget
      style={{
        height: "max-content",
        right: 75,
        top: 0,
        width: 450,
      }}
      title="Legend"
    >
      <FlexibleWrapper>
        <span
          style={{
            color: "grey",
            fontSize: "small",
            marginRight: 10,
            transform: "rotate(-180deg)",
            writingMode: "vertical-lr",
          }}
        >
          Genres
        </span>
        <Grid>
          {Object.values(Genre).map((genre) => (
            <div style={{ textAlign: "center" }}>
              <Tag color={getColorForGenre(genre).fill}>{genre}</Tag>
            </div>
          ))}
        </Grid>
      </FlexibleWrapper>
    </Widget>
  );
};

export default Legend;
