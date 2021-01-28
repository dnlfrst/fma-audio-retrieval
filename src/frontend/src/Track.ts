export interface Track {
  album: string;
  artist: string;
  date: Date;
  genre: string;
  ID: string;
  popularity: number;
  title: string;
}

export interface TrackFromAPI {
  album: string;
  artist: string;
  date_created: string;
  genre_top: string;
  id: number;
  interest: number;
  title: string;
}
