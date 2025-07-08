// Import React and core hooks
import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getUpcomingMovies } from "../api/tmdb-api";
import { BaseMovieProps } from "../types/interfaces";
import Spinner from "../components/spinner";
import { useQuery } from "react-query";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { MoviesContext } from "../contexts/moviesContext";
// Import filtering logic and UI componentAdd commentMore actions
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  releaseFilter,
} from "../components/movieFilterUI";
// https://mui.com/material-ui/react-pagination/
import { Pagination } from "@mui/material";
import { UpcomingMoviesResponse } from "../types/interfaces";

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
  value: 0, // 0 = show all years and MUST be a number, otherwise it won't show any movies
  condition: releaseFilter,
};

const UpcomingMoviesPage: React.FC = () => {
  // Access the mustWatchList and addToMustWatchList function from context
  const { addToMustWatchList, mustWatchList } = useContext(MoviesContext);

  const [page, setPage] = useState(1);
  // The below code has been slighly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3

  // Set up filtering state and logic using the custom `useFiltering` hook
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  /**
   * useQuery is a React Query hook used to fetch data and manage its state (loading, error, success).
   * It takes two main arguments:
   * - A unique query key (used internally for caching, refetching, etc.)
   * - A function that returns a promise (i.e., an async function that fetches data)
   *
   * It returns an object containing:
   * - `data`: the fetched data (in this case, an array of BaseMovieProps or undefined while loading)
   * - `isLoading`: a boolean indicating if the data is currently being fetched
   * - `isError`: a boolean indicating if an error occurred
   * - `error`: the actual error object if isError is true
   */
  // Fetch upcoming movies using React Query
  const {
    data: movies, // Rename the returned data as `movies`
    isLoading, // Indicates whether the query is still loading
    isError, // Indicates if an error occurred during fetch
    error, // Contains the error object if isError is true
  } = useQuery<UpcomingMoviesResponse>(
    ["upcomingMovies", page], // Unique query key for caching
    () => getUpcomingMovies(page), // Function that fetches the data
    { keepPreviousData: true }
  );

  // Use movie context to access mustWatchList and the function to update it
  // const { addToMustWatchList, mustWatchList } = useContext(MoviesContext);

  // useEffect ensures we log the updated mustWatchList after state changes.
  // Without it, console.log would show the old state due to React's async updates.
  useEffect(() => {
    console.log("Updated mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  useEffect(() => {
    console.log("API response:", movies);
  }, [movies]);

  // Show a loading spinner while the movies are being fetched
  if (isLoading) return <Spinner />;

  // Display an error message if the fetch failed
  if (isError)
    return <p>Error fetching upcoming movies: {(error as Error).message}</p>;

  // Apply filters to the movie list
  // const displayedMovies = movies ? filterFunction(movies) : [];

  /**
   * We use `movies.results` here because the API response `movies`
   * is an object containing metadata like `page` and `total_pages`,
   * and the actual array of movie objects is inside the `results` property.
   * The API function has been updated to return response.json();, otherwise
   * the pagination would not work
   */

  const displayedMovies = movies?.results ? filterFunction(movies.results) : [];

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

  // Render the page using the template, passing in the list of movies
  return (
    <>
      <PageTemplate
        title="Upcoming Movies"
        /**
         * It passes the list of movies to display.
         * If movies is truthy (i.e., data has been loaded and is available),
         * it will be passed as-is. If movies is falsy
         * (i.e., still undefined or null during loading),
         * then it will pass an empty array [] instead.
         */
        movies={displayedMovies} // Show filtered list
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
      />
      <Pagination
        color="primary"
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

export default UpcomingMoviesPage;
