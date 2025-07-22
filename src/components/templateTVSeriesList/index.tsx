import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import { TVSeriesListPageTemplateProps } from "../../types/interfaces";
import TVSeriesList from "../TvSeriesList";

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

/**
 * This template has been created as a copy of the templateMovieListPage, and adapted for TV series,
 * in order to be used with the 'series' array in place of the 'movies' array.
 * 'series' is fetched from the TVSeriesListProps interface 'series: BaseTVSeriesProps[];'
 * */
const TVSeriesListPageTemplate: React.FC<TVSeriesListPageTemplateProps> = ({
  series,
  title,
  action,
}) => {
  return (
    <>
      <Header title={title} />
      {/* The justifyContent gets content centered in the page */}
      <Grid container sx={styles.root} justifyContent="center">
        <Grid item xs={12}>
          {/* <Header title={title} /> */}
        </Grid>
        {/* We ensure that the container fills the whole space available.
        This achieves a centered card on the mobile view */}
        <Grid item container spacing={3} sx={{ width: "100%" }}>
          {/* Using TV SeriesList created 'ad hoc' and in place of 'MovieList' to display series */}
          <TVSeriesList series={series || []} action={action} />
        </Grid>
      </Grid>
    </>
  );
};

export default TVSeriesListPageTemplate;
