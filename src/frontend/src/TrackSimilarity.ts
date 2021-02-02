export interface TrackSimilarities {
  [id: string]: {
    all: TrackSimilarity;
    beat: TrackSimilarity;
    timbre: TrackSimilarity;
  };
}

export interface TrackSimilaritiesFromAPI {
  [id: string]: {
    all_features: TrackSimilarity;
    beats_features: TrackSimilarity;
    timbre_features: TrackSimilarity;
  };
}

export interface TrackSimilarity {
  distances: number[];
  indices: string[];
}

export enum TrackSimilarityFeature {
  COMBINED = "all",
  BEAT = "beat",
  TIMBRE = "timbre",
}
