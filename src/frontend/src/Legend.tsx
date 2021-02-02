import { Tag } from "antd";
import React from "react";
import styled from "styled-components";
import getColorForGenre from "./colors";
import FlexibleWrapper from "./FlexibleWrapper";
import RotatedLabel from "./RotatedLabel";
import { Genre } from "./TrackGenrePrediction";
import Widget from "./Widget";

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
        top: 335,
        width: 450,
      }}
      title="Legend"
    >
      <FlexibleWrapper>
        <RotatedLabel>Genres</RotatedLabel>
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
