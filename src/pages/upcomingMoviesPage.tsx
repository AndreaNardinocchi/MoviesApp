import React, { useContext, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getUpcomingMovies } from "../api/tmdb-api";
import { BaseMovieProps } from "../types/interfaces";
import Spinner from "../components/spinner";
import { useQuery } from "react-query";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { MoviesContext } from "../contexts/moviesContext";

const UpcomingMoviesPage: React.FC = () => {
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
  } = useQuery<BaseMovieProps[]>(
    ["upcomingMovies"], // Unique query key for caching
    getUpcomingMovies // Function that fetches the data
  );

  // Use movie context to access mustWatchList and the function to update it
  const { addToMustWatchList, mustWatchList } = useContext(MoviesContext);

  // useEffect ensures we log the updated mustWatchList after state changes.
  // Without it, console.log would show the old state due to React's async updates.
  useEffect(() => {
    console.log("Updated mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  // Show a loading spinner while the movies are being fetched
  if (isLoading) return <Spinner />;

  // Display an error message if the fetch failed
  if (isError)
    return <p>Error fetching upcoming movies: {(error as Error).message}</p>;

  // Render the page using the template, passing in the list of movies
  return (
    <PageTemplate
      title="Upcoming Movies" // Title displayed on the page
      /**
       * It passes the list of movies to display.
       * If movies is truthy (i.e., data has been loaded and is available),
       * it will be passed as-is. If movies is falsy
       * (i.e., still undefined or null during loading),
       * then it will pass an empty array [] instead.
       */
      movies={movies || []}
      // Action button to render beside each movie
      action={(movie: BaseMovieProps) => {
        const isInMustWatch = mustWatchList.some((m) => m.id === movie.id);

        const handleClick = () => {
          if (!isInMustWatch) {
            addToMustWatchList(movie);
          }
        };

        return (
          <>
            {/* Icon at the top, only if movie is in must-watch list */}
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

            {/* The original clickable icon stays in place */}
            <PlaylistAddIcon
              style={{
                marginLeft: "4%",
                marginRight: "4%",
                verticalAlign: "middle",
                fontSize: "30px",
                cursor: isInMustWatch ? "default" : "pointer",
                opacity: isInMustWatch ? 0.5 : 1, // visually show disabled after click
              }}
              onClick={handleClick}
            />
          </>
        );
      }}
    />
  );
};

export default UpcomingMoviesPage;
