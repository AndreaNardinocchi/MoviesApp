import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const RemoveFromMustWatchListIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const onUserRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Remove clicked for:", movie.id);
    context.removeFromMustWatchList(movie);
  };
  return (
    <IconButton
      aria-label="remove from Must Watch List"
      onClick={onUserRequest}
      style={{ paddingRight: 8 }}
    >
      <HighlightOffIcon
        style={{
          fontSize: "28px",
          color: "red",
        }}
      />
    </IconButton>
  );
};

export default RemoveFromMustWatchListIcon;

// This file has been created by cloning removeFromFavourites.tsx and adapted to enable the user to remove a Must Watch movie
