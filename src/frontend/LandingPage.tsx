import { GithubFilled } from "@ant-design/icons";
import { Button, Layout, PageHeader, Typography } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import AudioPlayer from "./AudioPlayer";
import SimilaritySearch from "./SimilaritySearch";
import Statistics from "./Statistics";
import TrackList from "./TrackList";

const { Content, Footer, Header } = Layout;
const { Link, Text } = Typography;

const AdaptiveHeader = styled(Header)`
  height: unset;
`;

const CenteredContent = styled(Content)`
  padding-left: 75px;
  padding-right: 75px;
`;

const CenteredFooter = styled(Footer)`
  text-align: center;
`;

const ColoredLink = styled(Link)`
  color: black !important;
`;

const FullSizeLayout = styled(Layout)`
  height: 100%;
`;

const GitHubLink = () => (
  <Button
    href={"https://github.com/dnlfrst/fma-audio-retrieval"}
    icon={
      <GithubFilled
        style={{ color: "black", fontSize: "x-large", verticalAlign: "middle" }}
      />
    }
    shape="circle"
    target="_blank"
    type="link"
  />
);

const Grid = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-areas: "statistics similaritySearch" "trackList similaritySearch" "trackList audioPlayer";
  grid-template-columns: 1fr 1fr;
`;

const Title = styled.span`
  color: var(--layout-header-color);
  font-weight: bold;
  font-size: large;

  span {
    margin: 0 6px;
  }
`;

const LandingPage = () => {
  const [isPlaying, setIsPLaying] = useState<boolean>(false);
  const [playingTrackID, setPlayingTrackID] = useState<number | undefined>();

  return (
    <FullSizeLayout>
      <AdaptiveHeader>
        <PageHeader
          extra={<GitHubLink />}
          title={
            <Title>
              <ColoredLink
                href="https://arxiv.org/abs/1612.01840"
                target="_blank"
              >
                <u>Free Music Archive</u>
              </ColoredLink>
              <span>📦</span>Audio Retrieval
            </Title>
          }
        />
      </AdaptiveHeader>
      <CenteredContent>
        <Grid>
          <Statistics />
          <SimilaritySearch />
          <TrackList
            isPlaying={isPlaying}
            playingTrackID={playingTrackID}
            setIsPlaying={setIsPLaying}
            setPlayingTrackID={setPlayingTrackID}
          />
          <AudioPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPLaying}
            trackID={playingTrackID}
          />
        </Grid>
      </CenteredContent>
      <CenteredFooter>
        <Text style={{ fontWeight: "lighter" }} type="secondary">
          Made by <b>Daniel Fürst</b> & <b>Jonathan Yang</b>
        </Text>
      </CenteredFooter>
    </FullSizeLayout>
  );
};

export default LandingPage;
