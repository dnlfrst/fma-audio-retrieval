import { Card } from "antd";
import React from "react";
import HTMLAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.less";
import styled from "styled-components";

const StyledHTMLAudioPlayer = styled(HTMLAudioPlayer)`
  box-shadow: unset;
`;

const AudioPlayer = () => (
  <Card style={{ gridArea: "audioPlayer" }}>
    <StyledHTMLAudioPlayer
      layout="stacked-reverse"
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    />
  </Card>
);

export default AudioPlayer;
