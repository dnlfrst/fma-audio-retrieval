export interface TrackSimilarities {
  all: TrackSimilarity;
  beat: TrackSimilarity;
  timbre: TrackSimilarity;
}

export interface TrackSimilaritiesFromAPI {
  all_features: TrackSimilarity;
  beats_features: TrackSimilarity;
  timbre_features: TrackSimilarity;
}

export interface TrackSimilarity {
  distances: number[];
  indices: number[];
}

export enum TrackSimilarityFeatures {
  BEAT = "beat",
  COMBINED = "all",
  TIMBRE = "timbre",
}
