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
  // console.log("MovieHeader props:", movie);

  // // Retrieve favourites from localStorage
  // const favouritesJSON = localStorage.getItem("favourites");

  // /** Tell TypeScript this is an array of movie objects
  //  * 'favourites'
  //  * It is an array' of movie objects from localStorage
  //  * favouritesJSON ? ... : []
  //  * This is a ternary operator: it checks if favouritesJSON has a truthy value.
  //  * If it does, it runs the expression before the :, otherwise returns an empty array.
  //  * JSON.parse(favouritesJSON)
  //  * Converts the string from localStorage back into a JavaScript object or array.
  //  * This is necessary because localStorage only stores strings.
  //  * as BaseMovieProps[]
  //  * This is a TypeScript type assertion. It tells TypeScript to treat the result of
  //  * JSON.parse as an array of BaseMovieProps objects.
  //  */
  // const favourites = favouritesJSON
  //   ? (JSON.parse(favouritesJSON) as BaseMovieProps[])
  //   : [];

  // /**
  //  * .some(...)
  //  * This is a JavaScript array method.
  //  * It returns true if at least one item in the array satisfies the given condition.
  //  * In this case, it returns true if fav.id is equal to a movie.id in the ocalStorage array 'favourites'
  //  * .some(...) is more efficient — it stops on the first match.
  //  * */
  // // const isFavourite = favourites.some((fav) => fav.id === movie.id);

  // // OR

  // /**
  //  * Or we can use map() and includes()
  //  * In this case, it returns true if fav.id is equal to a movie.id in the ocalStorage array 'favourites'
  //  * */
  // const isFavourite = favourites
  //   .map((favourite) => favourite.id)
  //   .includes(movie.id);

  // console.log(
  //   "isFavourite:",
  //   isFavourite,
  //   "movie.id:",
  //   movie.id,
  //   "favourites:",
  //   favourites
  // );

  const context = useContext(MoviesContext);

  if (!context) {
    throw new Error(
      "MoviesContext must be used within a MoviesContextProvider"
    );
  }

  const { favourites } = context;

  const isFavourite = favourites.includes(movie.id);

  return (
    <Paper component="div" sx={styles.root}>
      <IconButton aria-label="go back">
        <ArrowBackIcon color="primary" fontSize="large" />
      </IconButton>
      {isFavourite ? (
        <Avatar sx={styles.avatar}>
          <FavoriteIcon />
        </Avatar>
      ) : null}
      {/* OR */}
      {/* {favourite && (
        <Avatar sx={styles.avatar}>
          <FavoriteIcon />
        </Avatar>
      )} */}
      <Typography variant="h4" component="h3">
        {movie.title}
        {"   "}
        <a href={movie.homepage}>
          <HomeIcon color="primary" fontSize="large" />
        </a>
        <br />
        <span>{`${movie.tagline}`} </span>
      </Typography>
      <IconButton aria-label="go forward">
        <ArrowForwardIcon color="primary" fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default MovieHeader;
