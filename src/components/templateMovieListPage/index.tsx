import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import MovieList from "../movieList";
import { MovieListPageTemplateProps } from "../../types/interfaces";

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
    paddingRight: "1%",
    paddingLeft: "1%",
    paddingBottom: "2%",
    paddingTop: "1%",
    minHeight: "50vh",
  },
};

const MovieListPageTemplate: React.FC<MovieListPageTemplateProps> = ({
  movies,
  title,
  action,
}) => {
  return (
    <>
      <Header title={title} />

      {/* The justifyContent gets content centered in the page */}
      <Grid container sx={styles.root} justifyContent="center">
        <Grid item xs={12}></Grid>
        {/* We ensure that the container fills the whole space available.
        This achieves a centered card on the mobile view */}
        <Grid item container spacing={3} sx={{ width: "100%" }}>
          <MovieList action={action} movies={movies}></MovieList>
        </Grid>
      </Grid>
    </>
  );
};
export default MovieListPageTemplate;
