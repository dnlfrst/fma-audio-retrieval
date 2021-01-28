import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import { Track, TrackFromAPI } from "./Track";

const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const { data } = useGet({
    path: "/tracks",
    resolve: (tracks: TrackFromAPI[]) =>
      tracks.map((track) => {
        return {
          album: track.album,
          artist: track.artist,
          date: new Date(track.date_created),
          genre: track.genre_top,
          ID: track.id,
          popularity: track.interest,
          title: track.title,
        };
      }),
  });

  useEffect(() => data && setTracks(data), [data]);

  return tracks;
};

export default useTracks;
