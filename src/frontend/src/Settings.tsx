import { Form, Radio, Slider } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import FlexibleWrapper from "./FlexibleWrapper";
import RotatedLabel from "./RotatedLabel";
import { TrackSimilarityFeature } from "./TrackSimilarity";
import Widget from "./Widget";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const CompactForm = styled(Form)`
  .ant-row {
    margin-bottom: 5px;
  }

  .ant-row:last-child {
    margin: 0;
  }
`;

const StretchedRadioGroup = styled(RadioGroup)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  label {
    text-align: center;
  }
`;

const Settings = ({
  numberOfNodes,
  numberOfNeighbors,
  similarityFeature,
  setNumberOfNodes,
  setNumberOfNeighbors,
  setSimilarityFeature,
}: {
  numberOfNodes: number;
  numberOfNeighbors: number;
  similarityFeature: TrackSimilarityFeature;
  setNumberOfNodes: Dispatch<SetStateAction<number>>;
  setNumberOfNeighbors: Dispatch<SetStateAction<number>>;
  setSimilarityFeature: Dispatch<SetStateAction<TrackSimilarityFeature>>;
}) => {
  const [temporaryNumberOfNodes, setTemporaryNumberOfNodes] = useState<number>(
    numberOfNodes
  );
  const [
    temporaryNumberOfNeighbors,
    setTemporaryNumberOfNeighbors,
  ] = useState<number>(numberOfNeighbors);

  return (
    <Widget
      style={{
        height: "max-content",
        right: 75,
        top: 0,
        width: 450,
      }}
      title="Settings"
    >
      <FlexibleWrapper>
        <RotatedLabel>Similarity Search</RotatedLabel>
        <CompactForm layout="vertical" style={{ flex: 1 }}>
          <FormItem label="Feature to calculate similarity with">
            <StretchedRadioGroup
              defaultValue={TrackSimilarityFeature.COMBINED}
              onChange={(event) => setSimilarityFeature(event.target.value)}
              size="small"
              value={similarityFeature}
            >
              {Object.values(TrackSimilarityFeature).map((feature, index) => (
                <RadioButton key={index} value={feature}>
                  {feature}
                </RadioButton>
              ))}
            </StretchedRadioGroup>
          </FormItem>
          <FormItem
            label={
              <>
                Number of tracks (<i>n</i>)
              </>
            }
          >
            <Slider
              min={2}
              max={400}
              onAfterChange={(value) => setNumberOfNodes(value)}
              onChange={(value) => setTemporaryNumberOfNodes(value)}
              value={temporaryNumberOfNodes}
            />
          </FormItem>
          <FormItem
            label={
              <>
                Similar tracks for each track (<i>k</i>)
              </>
            }
          >
            <Slider
              min={1}
              max={10}
              onAfterChange={(value) => setNumberOfNeighbors(value)}
              onChange={(value) => setTemporaryNumberOfNeighbors(value)}
              value={temporaryNumberOfNeighbors}
            />
          </FormItem>
        </CompactForm>
      </FlexibleWrapper>
    </Widget>
  );
};

export default Settings;
