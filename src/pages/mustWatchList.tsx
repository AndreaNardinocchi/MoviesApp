import React, { useContext, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
// Import icon for potential remove or info action
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { MoviesContext } from "../contexts/moviesContext";
import { BaseMovieProps } from "../types/interfaces";

const MustWatchListPage: React.FC = () => {
  // Access the mustWatchList array from global context
  const { mustWatchList } = useContext(MoviesContext);

  // Log the list to console whenever it updates (useful for debugging)
  useEffect(() => {
    console.log("Rendering mustWatchList:", mustWatchList);
  }, [mustWatchList]);

  // Render the movie list page using the shared template
  return (
    <PageTemplate
      title="Must Watch Movies List"
      movies={mustWatchList} // Array of movie objects to display
      action={(
        movie: BaseMovieProps // Render an action icon next to each movie
      ) => (
        <PlaylistAddCheckIcon
          style={{
            marginLeft: "4%",
            marginRight: "4%",
            verticalAlign: "middle",
            fontSize: "30px",
            color: "green",
          }}
        />
      )}
    />
  );
};

export default MustWatchListPage;
