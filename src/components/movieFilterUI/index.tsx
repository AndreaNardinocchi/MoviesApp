import React, { useState } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseMovieProps } from "../../types/interfaces";

// eslint-disable-next-line react-refresh/only-export-components
export const titleFilter = (movie: BaseMovieProps, value: string): boolean => {
  return movie.title.toLowerCase().search(value.toLowerCase()) !== -1;
};

// eslint-disable-next-line react-refresh/only-export-components
export const genreFilter = (movie: BaseMovieProps, value: string) => {
  const genreId = Number(value);
  const genreIds = movie.genre_ids;
  return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};

/**
 * This function filters movies by their release year.
 * It returns true if the movie's release year matches the given year (value).
 * If value is 0, it means "All years" and the function returns true for every movie.
 * value: number is a parameter passed into the releaseFilter function, and
 * it represents the year selected by the user to filter movies by release date
 * */
// eslint-disable-next-line react-refresh/only-export-components
export const releaseFilter = (
  movie: BaseMovieProps,
  value: number
): boolean => {
  // If value is 0, do not filter out any movies, but show them all
  if (value === 0) return true;
  // If the movie has no release date, exclude it and return it as false
  else if (!movie.release_date) return false;
  /**
   * Extract the year from the movie's release_date string
   * getFullYear() is a built-in JavaScript Date object method.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
   */
  const movieYear = new Date(movie.release_date).getFullYear();
  // Return true only if the movie's release year equals the filter year
  return movieYear === Number(value);
};

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
  },
  fab: {
    marginTop: 8,
    position: "fixed",
    top: 20,
    right: 2,
  },
};

interface MovieFilterUIProps {
  onFilterValuesChange: (f: string, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  releaseFilter: number;
}

const MovieFilterUI: React.FC<MovieFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  releaseFilter,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={styles.fab}
      >
        Filter
      </Fab>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterCard
          onUserInput={onFilterValuesChange}
          titleFilter={titleFilter}
          genreFilter={genreFilter}
          releaseFilter={releaseFilter}
        />
      </Drawer>
    </>
  );
};

export default MovieFilterUI;
