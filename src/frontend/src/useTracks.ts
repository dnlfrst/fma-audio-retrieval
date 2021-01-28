import { useEffect, useState } from "react";
import tracksAsJSON from "../assets/tracks.json";

export interface Track {
  ID: number;
  title: string;
  genre: string;
  popularity: number;
  date: number;
}

const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const extractedTracks = [];

    for (const [trackID, track] of Object.entries(tracksAsJSON)) {
      extractedTracks.push({
        ...track,
        ID: trackID,
        date: new Date(track.date),
      });
    }

    setTracks(extractedTracks);
  }, []);

  return tracks;
};

export default useTracks;
