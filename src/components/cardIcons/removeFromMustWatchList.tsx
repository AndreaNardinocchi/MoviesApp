import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { MoviesContext } from "../../contexts/moviesContext";
import { BaseMovieProps } from "../../types/interfaces";

const RemoveFromMustWatchListIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const onUserRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Remove clicked for:", movie.id);
    context.removeFromFavourites(movie);
  };

  return (
    <IconButton
      aria-label="remove from Must Watch List"
      onClick={onUserRequest}
    >
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveFromMustWatchListIcon;

// This file has been created by cloning removeFromFavourites.tsx and adapted to enable the user to remove a Must Watch movie
