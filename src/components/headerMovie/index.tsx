import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { MovieDetailsProps } from "../../types/interfaces";
import { Avatar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
// https://materialui.co/icon/playlist-add-check
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const styles = {
  root: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 1.5,
  },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

const MovieHeader: React.FC<MovieDetailsProps> = (movie) => {
  const context = useContext(MoviesContext);

  if (!context) {
    throw new Error(
      "MoviesContext must be used within a MoviesContextProvider"
    );
  }

  // Destructure favourites and mustWatchList arrays from the context
  const { favourites, mustWatchList } = context;

  // Check if the current movie is in the mustWatchList
  // `.some()` checks if any movie in the list has the same id as the current one
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
  const isMustWatch = mustWatchList.some((m) => m.id === movie.id);

  // Check if the current movie is in the favourites list (by id)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const isFavourite = favourites.includes(movie.id);

  return (
    // Root Paper component providing structure and styling for the movie header
    <Paper component="div" sx={styles.root}>
      {/* Back arrow icon button (could be used for navigation) */}
      <IconButton aria-label="go back">
        <ArrowBackIcon color="primary" fontSize="large" />
      </IconButton>

      {/* Show a red avatar with a heart icon if the movie is a favourite */}
      {isFavourite && (
        <Avatar sx={styles.avatar}>
          <FavoriteIcon />
        </Avatar>
      )}

      {/* Show a green avatar with a checklist icon if the movie is in must-watch list */}
      {isMustWatch && (
        <Avatar sx={{ backgroundColor: "rgb(0, 128, 0)" }}>
          <PlaylistAddCheckIcon />
        </Avatar>
      )}

      {/* Main movie title and homepage link */}
      <Typography variant="h4" component="h3">
        {movie.title}{" "}
        {/* Link to the movie's official homepage, if available */}
        <a href={movie.homepage}>
          <HomeIcon color="primary" fontSize="large" />
        </a>
        <br />
        {/* Display the movie's tagline below the title */}
        <span>{`${movie.tagline}`} </span>
      </Typography>

      {/* Forward arrow icon button (could be used for navigation) */}
      <IconButton aria-label="go forward">
        <ArrowForwardIcon color="primary" fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default MovieHeader;
