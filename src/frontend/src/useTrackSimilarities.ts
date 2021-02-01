import { useEffect, useState } from "react";
import { useGet } from "restful-react";
import { TrackSimilarity } from "../TrackSimilarity";

const useTrackSimilarities = (trackID: string) => {
  const [trackSimilarities, setTrackSimilarities] = useState<TrackSimilarity>();
  const { data } = useGet<TrackSimilarity>({
    path: `/tracks/${trackID}/similarities`,
  });

  useEffect(() => data && setTrackSimilarities(data), [data]);

  return trackSimilarities;
};

export default useTrackSimilarities;
