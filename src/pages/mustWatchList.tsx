import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
// Import icon for potential remove or info action
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MoviesContext } from "../contexts/moviesContext";
import { BaseMovieProps } from "../types/interfaces";
// https://materialui.co/icon/highlight-off
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, IconButton } from "@mui/material";
// Import filter logic and UI
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  releaseFilter,
} from "../components/movieFilterUI";
import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";
import { getMovie } from "../api/tmdb-api";

// Initial filter configuration for title
const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};

// Initial filter configuration for genre
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

// Define the default filter state for release filtering
const releaseFiltering = {
  name: "release",
  value: 0, // 0 = show all years and MUST be a number, otherwise it won't show any movies
  condition: releaseFilter,
};

const MustWatchListPage: React.FC = () => {
  /** 
       * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
       If undefined or empty, fallback to 'en-US'
       */
  const { i18n } = useTranslation();
  const lang = i18n.language || "en-US";
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  // Access global must-watch list and remove function from context
  const { mustWatchList, removeFromMustWatchList } = useContext(MoviesContext);

  /**
   * This React state hook declares a new state called 'localizedList', which is empty at first,
   * and set a localized list updating the new array state of movie objects (array destructuring).
   * We need localizedList because mustWatchList (from context) stores the original movies in the language
   * they were selected in the upcomingMovies page.
   * Once we switch language, we want to fetch an updated version of the mustWatchList, which means
   * an updated verssion of each movie, and store the updated movies in the local state, namely the 'localizedList'.
   */
  const [localizedList, setLocalizedList] = useState<BaseMovieProps[]>([]);

  // Log list to console on update (for development/debugging)
  // useEffect(() => {
  //   console.log("Rendering mustWatchList:", mustWatchList);
  // }, [mustWatchList]);

  /**
   * useEffect as a React Hook Effects lets us run our code after rendering so that we can synchronize our
   * component with the useState declared above for localizedList
   * */
  useEffect(() => {
    /**
     * Define an async function to fetch localized data for each movie in the mustWatch list.
     */
    const fetchLocalized = async () => {
      /**
       * Create an array to hold the updated movie objects
       */
      const updated = [];
      /**
       * This executes a loop that operates on a sequence of values sourced from an iterable object,
       * which is in this case the iterable object is 'mustWatchList', whose variable is 'movie'
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
       */
      for (const movie of mustWatchList) {
        /**
         * Call the getMovie() API to get full movie data as localized.
         * This includes translated title, overview, poster, etc.
         */
        const data = await getMovie(movie.id, lang);
        /**
         * Push the new movie object to the array
         * localizedList
         */
        updated.push({
          /**
           * ...movie is the 'spreaded' to copy all existing data of the movie object.
           * After spreading, we can add or overwrite specific properties, like title, overview, poster path,
           * release date, and vote average with new translated values.
           * It creates a new object that keeps all old data except the ones we explicitly change.
           */
          ...movie,
          title: data.title,
          overview: data.overview,
          poster_path: data.poster_path,
          release_date: data.release_date,
          vote_average: data.vote_average,
        });
      }
      /**
       * Save the updated list of localized movie data to state,
       * so the UI can render it with the correct language.
       */
      setLocalizedList(updated);
    };

    fetchLocalized();
  }, [mustWatchList, lang]);

  // Initialize filtering state and logicAdd commentMore actions
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  // Apply active filters to the must-watch list
  //const displayedMovies = mustWatchList ? filterFunction(mustWatchList) : [];
  const displayedMovies = filterFunction(localizedList);

  // Called when the user changes title, genre filter, or release year
  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value };
    const updatedFilterSet =
      /**
       * If type === "title", update the first filter.
       * Otherwise, if type === "genre", update the second filter.
       * Otherwise, type === "release", update the third filter.
       */
      type === "title"
        ? [changedFilter, filterValues[1], filterValues[2]]
        : type === "genre"
        ? [filterValues[0], changedFilter, filterValues[2]]
        : [filterValues[0], filterValues[1], changedFilter]; // handles "release"
    setFilterValues(updatedFilterSet);
  };

  return (
    // Render a reusable PageTemplate component to display the list of must-watch movies
    <>
      <PageTemplate
        // Title to be shown at the top of the page
        // title="Must Watch Movies List"
        title={t("must_watch_movies_list")}
        // Pass the list of must-watch movies to be displayed by the template
        movies={displayedMovies}
        // Define a custom action to show next to each movie card
        action={(movie: BaseMovieProps) => (
          // Use a flex container to horizontally align the icons with a small gap
          <Box display="flex" alignItems="center" gap={0.2}>
            {/* Icon to indicate this movie is part of the Must Watch list */}
            <PlaylistAddCheckIcon
              style={{
                fontSize: "30px", // Set icon size
                color: "green", // Set icon color to green
              }}
            />

            {/* Button to remove the movie from the must-watch list */}
            <IconButton
              size="small"
              onClick={() => removeFromMustWatchList(movie)}
              style={{ paddingRight: 8 }}
            >
              <HighlightOffIcon
                style={{
                  fontSize: "28px",
                  color: "red",
                }}
              />
            </IconButton>
          </Box>
        )}
      />

      {/* Filter UI to allow user to filter by title and genre */}
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        // This is NOT a string, so we wrap it with a Number()
        releaseFilter={Number(filterValues[2].value)}
      />
    </>
  );
};

export default MustWatchListPage;
