import { Card } from "antd";
import React, { useCallback } from "react";
import HTMLAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.less";
import styled from "styled-components";
import useTracks from "./useTracks";

const ProminentTitle = styled.span`
  font-size: large;
  font-weight: ${(styles) =>
    styles.isPlaying || styles.trackID !== undefined ? 600 : 200};
  font-style: ${(styles) =>
    styles.isPlaying || styles.trackID !== undefined ? "unset" : "italic"};
  margin-left: 15px;
`;

const StyledHTMLAudioPlayer = styled(HTMLAudioPlayer)`
  box-shadow: unset;
`;

const AudioPlayer = ({
  isPlaying,
  setIsPlaying,
  trackID,
}: {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  trackID: number;
}) => {
  const audioPlayer = useCallback(
    (element: HTMLAudioPlayer) => {
      const audioElement: HTMLAudioElement = element?.audio.current;

      if (audioElement && !audioElement.paused && !isPlaying)
        audioElement.pause();

      if (audioElement && audioElement.paused && isPlaying)
        audioElement.play().then();
    },
    [isPlaying]
  );
  const paddedTrackID = trackID?.toString().padStart(6, "0");
  const tracks = useTracks();

  return (
    <Card style={{ gridArea: "audioPlayer" }}>
      <ProminentTitle isPlaying={isPlaying} trackID={trackID}>
        {trackID
          ? tracks.find((track) => track.ID === trackID).title
          : "Select a song to start playing..."}
      </ProminentTitle>
      <StyledHTMLAudioPlayer
        layout="stacked-reverse"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        ref={audioPlayer}
        src={
          trackID !== undefined
            ? `http://localhost:5000/tracks/${paddedTrackID}/audio`
            : undefined
        }
      />
    </Card>
  );
};

export default AudioPlayer;
