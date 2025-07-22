import React from "react";
import Grid from "@mui/material/Grid";
import { TVSeriesListProps } from "../../types/interfaces";
import TVSeriesCard from "../tvSeriesCard";

// 'series' is fetched from the TVSeriesListProps interface 'series: BaseTVSeriesProps[];'
const TVSeriesList: React.FC<TVSeriesListProps> = ({ series, action }) => {
  const seriesCards = series.map((tv) => (
    <Grid key={tv.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
      <TVSeriesCard series={tv} action={action} />
    </Grid>
  ));
  return seriesCards;
};

export default TVSeriesList;

/**
 * This is the TV series list grid created by cloning the Movies List one and adapted to be used
 * with the 'series' array
 */
