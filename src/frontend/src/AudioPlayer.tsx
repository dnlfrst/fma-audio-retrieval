import React, { Dispatch, SetStateAction } from "react";
import HTMLAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.less";
import styled from "styled-components";
import Widget from "./Widget";

const StyledHTMLAudioPlayer = styled(HTMLAudioPlayer)`
  box-shadow: unset;
  margin: 0 auto;
  width: 512px;
`;

const AudioPlayer = ({
  setPlaybackProgress,
  trackID,
}: {
  setPlaybackProgress: Dispatch<SetStateAction<number>>;
  trackID: string;
}) => {
  return (
    <Widget size="small">
      <StyledHTMLAudioPlayer
        autoPlay={false}
        autoPlayAfterSrcChange={false}
        layout="stacked-reverse"
        onEnded={(event) =>
          setPlaybackProgress(
            Math.ceil((event.target as HTMLAudioElement).currentTime)
          )
        }
        onListen={(event) =>
          setPlaybackProgress((event.target as HTMLAudioElement).currentTime)
        }
        src={
          trackID !== undefined
            ? `http://localhost:5000/tracks/${trackID}/audio`
            : undefined
        }
        volume={0.5}
      />
    </Widget>
  );
};

export default AudioPlayer;
