import React from "react";
import Header from "../headerMovieList";
import Grid from "@mui/material/Grid";
import { TVSeriesListPageTemplateProps } from "../../types/interfaces";
import TVSeriesList from "../TvSeriesList";

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
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
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header title={title} />
      </Grid>
      <Grid item container sx={{ marginTop: "1rem" }}>
        {/* Using TV SeriesList created 'ad hoc' and in place of 'MovieList' to display series */}
        <TVSeriesList series={series || []} action={action} />
      </Grid>
    </Grid>
  );
};

export default TVSeriesListPageTemplate;
