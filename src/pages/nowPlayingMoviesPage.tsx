// Import React and core hooks
import React, { useContext, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getNowPlayingMovies } from "../api/tmdb-api";
// Type definition for movie data
import { BaseMovieProps } from "../types/interfaces";
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
// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-hooks/rules-of-hooks
// const navigate = useNavigate();

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

const NowPlayingMoviesPage: React.FC = () => {
  // Access the mustWatchList and addToMustWatchList function from context
  const { addToMustWatchList, mustWatchList } = useContext(MoviesContext);

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
  } = useQuery<BaseMovieProps[]>(
    ["nowPlayingMovies"], // unique cache key
    getNowPlayingMovies // fetch function
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

  const displayedMovies = movies ? filterFunction(movies) : [];

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
    <>
      {/*Render the movie list using the template */}
      <PageTemplate
        title="Now Playing Movies"
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
    </>
  );
};

export default NowPlayingMoviesPage;
