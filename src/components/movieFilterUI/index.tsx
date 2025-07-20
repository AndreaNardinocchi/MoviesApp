import React, { useState } from "react";
import FilterCard from "../filterMoviesCard";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseMovieProps } from "../../types/interfaces";
import { useTranslation } from "react-i18next";

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
    marginTop: "3%",
    position: "fixed",
    top: {
      xs: "8%",
      sm: "6%",
      md: "5%",
      lg: "4%",
    },
    right: "2%",
    bgcolor: "#8E4585",
    color: "white",
  },
};

interface MovieFilterUIProps {
  onFilterValuesChange: (f: string, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  releaseFilter: number;
  // Controls the sorting order of movies by release date.
  sortOrder: string;
}

const MovieFilterUI: React.FC<MovieFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  releaseFilter,
  sortOrder,
}) => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Fab
        color="default"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          // Spread the base fab styles defined earlier
          ...styles.fab,
          // https://mui.com/system/getting-started/the-sx-prop/?
          "&:hover": {
            // Text color on hover
            color: "#000000",
            // Change background slightly on hover
            bgcolor: "#ffe6f0",
          },
        }}
      >
        {t("filter")}
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
          sortOrder={sortOrder}
        />
      </Drawer>
    </>
  );
};

export default MovieFilterUI;
