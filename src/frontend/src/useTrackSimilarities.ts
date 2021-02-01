import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import {
  TrackSimilarities,
  TrackSimilaritiesFromAPI,
} from "../TrackSimilarity";

const useTrackSimilarities = (trackID: string) => {
  const [
    trackSimilarities,
    setTrackSimilarities,
  ] = useState<TrackSimilarities>();
  const { data } = useGet<TrackSimilarities>({
    path: `/tracks/${trackID}/similarities`,
    resolve: (trackSimilarities: TrackSimilaritiesFromAPI) => {
      return {
        all: trackSimilarities.all_features,
        beat: trackSimilarities.beats_features,
        timbre: trackSimilarities.timbre_features,
      };
    },
  });

  useEffect(() => data && setTrackSimilarities(data), [data]);

  return trackSimilarities;
};

export default useTrackSimilarities;
