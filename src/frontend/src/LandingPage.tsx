import { GithubFilled } from "@ant-design/icons";
import { Button, Layout, PageHeader, Typography } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import AudioPlayer from "./AudioPlayer";
import SimilaritySearch from "./SimilaritySearch";
import TrackList from "./TrackList";

const { Content, Footer, Header } = Layout;
const { Link, Text } = Typography;

const AdaptiveHeader = styled(Header)`
  height: unset;
`;

const CenteredContent = styled(Content)`
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-right: 75px;
  position: relative;
`;

const CenteredFooter = styled(Footer)`
  background-color: white;
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

const Title = styled.span`
  color: var(--layout-header-color);
  font-weight: bold;
  font-size: large;

  span {
    margin: 0 6px;
  }
`;

const LandingPage = () => {
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
        <SimilaritySearch />
        <AudioPlayer trackID={playingTrackID} />
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
