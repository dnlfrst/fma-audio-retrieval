import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import {
  Genre,
  TrackGenrePrediction,
  TrackGenrePredictionFromAPI,
} from "./TrackGenrePrediction";

const useTrackGenrePredictions = (trackID: string) => {
  const [trackGenrePredictions, setTrackGenrePredictions] = useState<
    TrackGenrePrediction[] | undefined
  >([]);
  const { data, error, refetch } = useGet({
    lazy: true,
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

  useEffect(() => {
    if (trackID) refetch().then();
  }, [trackID]);

  useEffect(() => {
    if (data) setTrackGenrePredictions(data);
    if (error && error.status === 404) setTrackGenrePredictions(undefined);
  }, [data, error]);

  return trackGenrePredictions;
};

export default useTrackGenrePredictions;
