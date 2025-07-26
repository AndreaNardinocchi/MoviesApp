// Import React and core hooks
import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getNowPlayingMovies } from "../api/tmdb-api";
// Type definition for movie data
import { BaseMovieProps, NowPlayingMoviesResponse } from "../types/interfaces";
import Spinner from "../components/spinner";
// React Query hook for async fetching
import { useQuery } from "react-query";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
// React context that holds global movie state (like must-watch list)
import { MoviesContext } from "../contexts/moviesContext";
// Import filtering logic and UI component
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  releaseFilter,
} from "../components/movieFilterUI";
// https://mui.com/material-ui/react-pagination/
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";

// Define the default filter state for title filtering
const titleFiltering = {
  name: "title",
  value: "", // Start with no filter applied
  condition: titleFilter, // The actual filter function
};

// Define the default filter state for genre filtering
const genreFiltering = {
  name: "genre",
  value: "0", // "0" typically means "All genres"
  condition: genreFilter, // The actual filter function
};

// Define the default filter state for release filtering
const releaseFiltering = {
  name: "release",
  value: "0",
  condition: releaseFilter,
};

const NowPlayingMoviesPage: React.FC = () => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();

  const lang = i18n.language || "en-US";

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("now_playing")} | MoviesApp`;
  }, [t]);

  // Access the mustWatchList and addToMustWatchList function from context
  const { addToMustWatchList, mustWatchList } = useContext(MoviesContext);

  const [page, setPage] = useState(1);
  // The below code has been slighly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3

  // Create the state for 'sortOrder' and set to newest first
  const [sortOrder, setSortOrder] = useState("desc");

  // Set up filtering state and logic using the custom `useFiltering` hook
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  // Fetch the upcoming movies list using React Query
  const {
    data: movies, // the array of upcoming movies
    isLoading, // true while the request is loading
    isError, // true if an error occurred
    error, // the error object if any
  } = useQuery<NowPlayingMoviesResponse>(
    ["nowPlayingMovies", page, lang], // unique cache key
    () => getNowPlayingMovies(page, lang), // fetch function
    { keepPreviousData: true }
  );

  // useEffect ensures we log the updated mustWatchList after state changes.
  // Without it, console.log would show the old state due to React's async updates.
  useEffect(() => {
    console.log("Updated mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  if (isLoading) return <Spinner />;

  // Show error if fetching fails
  if (isError)
    return <p>Error fetching upcoming movies: {(error as Error).message}</p>;

  // const displayedMovies = movies ? filterFunction(movies) : [];

  /**
   * We use `movies.results` here because the API response `movies`
   * is an object containing metadata like `page` and `total_pages`,
   * and the actual array of movie objects is inside the `results` property.
   * The API function has been updated to return response.json();, otherwise
   * the pagination would not work
   */
  const displayedMovies = movies?.results ? filterFunction(movies.results) : [];

  /**
   * We use the spread operator now to create a shallow copy of 'displayedTVSeries'
   * before sorting because `.sort()` changes the original array in place, whereas the spread
   * operator ensure we only create that shallow copy and won't modify the original array.
   * Without spread operator, the sort() function was actually creating duplicates for certain
   * movies. This ensures we don't modify the original filtered list,
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   * https://stackoverflow.com/questions/74242074/sorting-array-of-objects-by-iso-date?
   * */
  const sortedDisplayedMovies = [...displayedMovies].sort((a, b) => {
    if (!a.release_date || !b.release_date) return 0;
    /**
     * We sort the already 'filtered movies' by their release_date,
     * depending on the sortOrder selected by the user.
     * If sortOrder is 'asc', compare a to b (oldest first)
     * If sortOrder is 'desc', compare b to a (newest first)
     * */
    return sortOrder === "asc"
      ? a.release_date.localeCompare(b.release_date)
      : b.release_date.localeCompare(a.release_date);
  });

  // Called when the user changes title, genre filter, release year, and sort
  const changeFilterValues = (type: string, value: string) => {
    if (type === "sort") {
      /**
       * Sort is managed by its own state sortOrder, not in the filterValues array.
       * So we update the sort order separately and exit early to skip the rest of the filter logic.
       * */
      setSortOrder(value);
      /**
       * So, by returning early, we make sure only setSortOrder is called,
       * and we avoid mistakenly trying to update filter state with an invalid type.
       */
      return;
    }
    /**
     * After After filtering, we sort the already 'filtered movies' by their release_date,
     * depending on the sortOrder selected by the user.
     * If sortOrder is 'asc', compare a to b (oldest first)
     * If sortOrder is 'desc', compare b to a (newest first)
     * */
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
        : [filterValues[0], filterValues[1], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  return (
    <>
      {/*Render the movie list using the template */}
      <PageTemplate
        // title="Now Playing Movies"
        title={t("now_playing_movies")}
        movies={sortedDisplayedMovies} // Show filtered list
        action={(movie: BaseMovieProps) => {
          // Check if the movie is already in the must-watch list
          const isInMustWatch = mustWatchList.some((m) => m.id === movie.id);

          // Add the movie to the must-watch list if not already there
          const handleClick = () => {
            if (!isInMustWatch) {
              addToMustWatchList(movie);
            }
          };

          return (
            <>
              {/* Overlay green icon if movie is already in must-watch list */}
              {isInMustWatch && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                  }}
                >
                  <PlaylistAddIcon
                    style={{
                      fontSize: 28,
                      color: "green",
                    }}
                  />
                </div>
              )}

              {/* Add-to-must-watch icon (greyed out if already added) */}
              <PlaylistAddIcon
                style={{
                  marginLeft: "4%",
                  marginRight: "4%",
                  verticalAlign: "middle",
                  fontSize: "30px",
                  cursor: isInMustWatch ? "default" : "pointer",
                  opacity: isInMustWatch ? 0.5 : 1,
                }}
                onClick={handleClick}
              />
            </>
          );
        }}
      />

      {/* Render the title/genre filtering UI BELOW the movie list */}
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        // This is NOT a string, so we wrap it with a Number()
        releaseFilter={Number(filterValues[2].value)}
        sortOrder={sortOrder}
      />
      <Pagination
        // color="primary"
        size="large"
        count={movies?.total_pages || 1}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white", // or match your theme
          py: 1,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #ccc",
        }}
      />
    </>
  );
};

export default NowPlayingMoviesPage;
