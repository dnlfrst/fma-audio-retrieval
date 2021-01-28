import React from "react";
import HTMLAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.less";
import styled from "styled-components";

const StyledHTMLAudioPlayer = styled(HTMLAudioPlayer)`
  box-shadow: unset;
  width: 512px;
`;

const AudioPlayer = ({ trackID }: { trackID: number }) => {
  return (
    <StyledHTMLAudioPlayer
      layout="stacked-reverse"
      src={
        trackID !== undefined
          ? `http://localhost:5000/tracks/${trackID}/audio`
          : undefined
      }
      volume={0.5}
    />
  );
};

export default AudioPlayer;
