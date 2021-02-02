import { presetPalettes } from "@ant-design/colors";
import { Genre } from "./TrackGenrePrediction";

const getColorForGenre = (genre?: Genre): { fill: string; stroke: string } => {
  const colorPalettes = Object.values(presetPalettes);
  const genres = Object.values(Genre);

  if (genres.includes(genre)) {
    const genreIndex = genres.indexOf(genre);

    return {
      fill: colorPalettes[genreIndex][4],
      stroke: colorPalettes[genreIndex][6],
    };
  } else {
    return {
      fill: "white",
      stroke: "grey",
    };
  }
};

export const getGenreColors = () =>
  Object.values(Genre).map((genre) => getColorForGenre(genre).fill);

export default getColorForGenre;
