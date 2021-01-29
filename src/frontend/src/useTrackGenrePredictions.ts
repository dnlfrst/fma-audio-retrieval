import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import {
  Genre,
  TrackGenrePrediction,
  TrackGenrePredictionFromAPI,
} from "./TrackGenrePrediction";

const useTrackGenrePredictions = (trackID: string) => {
  const [trackGenrePredictions, setTrackGenrePredictions] = useState<
    TrackGenrePrediction[]
  >([]);
  const { data } = useGet({
    path: `/tracks/${trackID}/genres`,
    resolve: (predictions: TrackGenrePredictionFromAPI[]) =>
      predictions
        .map((prediction) => {
          const { time_second, ...genres } = prediction;

          return Object.entries(genres).map(
            ([genre, probability]: [genre: Genre, probability: number]) => {
              return {
                genre,
                probability,
                second: time_second,
              };
            }
          );
        })
        .flat(),
  });

  useEffect(() => data && setTrackGenrePredictions(data), [data]);

  return trackGenrePredictions;
};

export default useTrackGenrePredictions;
