import { GithubFilled, LoadingOutlined } from "@ant-design/icons";
import { Button, Layout, PageHeader, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AudioPlayer from "./AudioPlayer";
import SimilaritySearch from "./SimilaritySearch";
import useTracks from "./useTracks";

const { Content, Footer, Header } = Layout;
const { Link, Text } = Typography;

const AdaptiveHeader = styled(Header)`
  height: unset;
`;

const CenteredContent = styled(Content)`
  background-color: white;
  display: grid;
  grid-template-rows: auto fit-content(25%);
  padding-bottom: 25px;
  padding-left: 75px;
  padding-right: 75px;
`;

const CenteredFooter = styled(Footer)`
  background-color: white;
  text-align: center;
`;

const CenteredSpin = styled(Spin)`
  align-items: center;
  display: flex;
  justify-content: center;
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
  const [playingTrackID, setPlayingTrackID] = useState<string | undefined>();
  const [selectedTrackID, setSelectedTrackID] = useState<string | undefined>();
  const tracks = useTracks();

  useEffect(() => {
    if (tracks?.length === 0) return;

    const randomTrackID =
      tracks?.[Math.floor(Math.random() * tracks.length)].ID;

    setSelectedTrackID(randomTrackID);
  }, [tracks]);

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
        {selectedTrackID ? (
          <SimilaritySearch trackID={selectedTrackID} />
        ) : (
          <CenteredSpin indicator={<LoadingOutlined />} />
        )}
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
