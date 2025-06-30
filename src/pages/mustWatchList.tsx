import React, { useContext, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
// Import icon for potential remove or info action
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MoviesContext } from "../contexts/moviesContext";
import { BaseMovieProps } from "../types/interfaces";
// https://materialui.co/icon/highlight-off
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, IconButton } from "@mui/material";

const MustWatchListPage: React.FC = () => {
  // Access the mustWatchList array from global context
  const { mustWatchList, removeFromMustWatchList } = useContext(MoviesContext);

  // Log the list to console whenever it updates (useful for debugging)
  useEffect(() => {
    console.log("Rendering mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  return (
    // Render a reusable PageTemplate component to display the list of must-watch movies
    <PageTemplate
      // Title to be shown at the top of the page
      title="Must Watch Movies List"
      // Pass the list of must-watch movies to be displayed by the template
      movies={mustWatchList}
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

          {/* Icon button to remove the movie from the Must Watch list */}
          <IconButton
            size="small" // Smaller button size for compact display
            onClick={() => removeFromMustWatchList(movie)} // Handle click to remove the movie
            style={{ paddingRight: 8 }} // Adding a bit of right padding for spacing
          >
            <HighlightOffIcon
              style={{
                fontSize: "28px", // Slightly smaller than the check icon
                color: "red", // Use red color to indicate deletion
              }}
            />
          </IconButton>
        </Box>
      )}
    />
  );
};

export default MustWatchListPage;
