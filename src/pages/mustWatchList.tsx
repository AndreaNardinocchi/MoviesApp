import React, { useContext, useEffect } from "react";
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
  // Access global must-watch list and remove function from context
  const { mustWatchList, removeFromMustWatchList } = useContext(MoviesContext);

  // Log list to console on update (for development/debugging)
  useEffect(() => {
    console.log("Rendering mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  // Initialize filtering state and logicAdd commentMore actions
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  // Apply active filters to the must-watch list
  const displayedMovies = mustWatchList ? filterFunction(mustWatchList) : [];

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
        title="Must Watch Movies List"
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
