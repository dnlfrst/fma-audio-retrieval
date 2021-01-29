export enum Genre {
  ELECTRONIC = "Electronic",
  EXPERIMENTAL = "Experimental",
  FOLK = "Folk",
  HIP_HOP = "Hip-Hop",
  INSTRUMENTAL = "Instrumental",
  INTERNATIONAL = "International",
  POP = "Pop",
  ROCK = "Rock",
}

export interface TrackGenrePrediction {
  genre: Genre;
  probability: number;
  second: number;
}

export type TrackGenrePredictionFromAPI = {
  [genre in Genre]: number;
} & {
  time_second: number;
};
