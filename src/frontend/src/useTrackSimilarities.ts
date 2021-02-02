import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import {
  TrackSimilarities,
  TrackSimilaritiesFromAPI,
  TrackSimilarity,
} from "./TrackSimilarity";

const useTrackSimilarities = (trackID: string) => {
  const [
    trackSimilarities,
    setTrackSimilarities,
  ] = useState<TrackSimilarities>();
  const { data } = useGet<TrackSimilarities>({
    path: `/tracks/${trackID}/similarities?nodes=200&neighbors=10`,
    resolve: (trackSimilarities: TrackSimilaritiesFromAPI) => {
      const formattedTrackSimilarities: TrackSimilarities = {};

      Object.entries(trackSimilarities).forEach(
        ([id, features]: [
          string,
          {
            all_features: TrackSimilarity;
            beats_features: TrackSimilarity;
            timbre_features: TrackSimilarity;
          }
        ]) => {
          formattedTrackSimilarities[id.padStart(6, "0")] = {
            all: {
              ...features.all_features,
              indices: features.all_features.indices.map((index) =>
                index.toString().padStart(6, "0")
              ),
            },
            beat: {
              ...features.beats_features,
              indices: features.beats_features.indices.map((index) =>
                index.toString().padStart(6, "0")
              ),
            },
            timbre: {
              ...features.timbre_features,
              indices: features.timbre_features.indices.map((index) =>
                index.toString().padStart(6, "0")
              ),
            },
          };
        }
      );

      return formattedTrackSimilarities;
    },
  });

  useEffect(() => data && setTrackSimilarities(data), [data]);

  return trackSimilarities;
};

export default useTrackSimilarities;
