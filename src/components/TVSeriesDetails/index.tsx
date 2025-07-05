import React from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import { TVSeriesDetailsProps } from "../../types/interfaces";
import { Link } from "react-router-dom";

const styles = {
  chipSet: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 1.5,
    margin: 0,
  },
  chipLabel: {
    margin: 0.5,
  },
};

const TVSeriesDetails: React.FC<TVSeriesDetailsProps> = (series) => {
  return (
    <>
      {/* Overview */}
      <Typography variant="h5" component="h3">
        Overview
      </Typography>
      <Typography variant="h6" component="p">
        {series.overview}
      </Typography>

      {/* Genres */}
      <Paper component="ul" sx={styles.chipSet}>
        <li>
          <Chip label="Genres" sx={styles.chipLabel} color="primary" />
        </li>
        {series.genres?.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} />
          </li>
        ))}
      </Paper>

      {/* Runtime, Seasons, Episodes, Rating, First Air Date */}
      <Paper component="ul" sx={styles.chipSet}>
        <Chip label={`Seasons: ${series.number_of_seasons}`} />
        <Chip label={`Episodes: ${series.number_of_episodes}`} />
        <Chip icon={<StarRate />} label={`${series.vote_average}`} />
        <Chip label={`First Aired: ${series.first_air_date}`} />
      </Paper>

      {/* Production Countries */}
      <Paper component="ul" sx={styles.chipSet}>
        <li>
          <Chip
            label="Production Countries"
            sx={styles.chipLabel}
            color="primary"
          />
        </li>
        {series.production_countries?.map((country) => (
          <li key={country.name}>
            <Chip label={country.name} />
          </li>
        ))}
      </Paper>

      {/* Cast */}
      <Typography variant="h5" component="h3">
        Cast
      </Typography>
      {/* 
      To safely handle the series.cast potentially being undefined or empty, we are using
      Array.isArray to avoid '.length' checks on possibly undefined values.
      It ensures it’s a valid array before accessing .length or using .map()
      Only render cast list if it's a valid non-empty array.
      https://www.geeksforgeeks.org/typescript-array-isarray-method/?utm_source=chatgpt.com
      */}
      {Array.isArray(series.cast) && series.cast.length > 0 ? (
        <Paper component="ul" sx={styles.chipSet}>
          {series.cast.map((actor) => (
            <li key={actor.id}>
              <Link
                to={`/actor/${actor.id}`} // URL path for the actor page
                state={{ actor: actor, series: series }} // Pass actor and series data as navigation state
                style={{ textDecoration: "none" }} // Optional styling to remove underline from link
              >
                <Chip
                  clickable
                  label={`${actor.name} (${actor.character})`}
                  sx={styles.chipLabel}
                />
              </Link>
            </li>
          ))}
        </Paper>
      ) : (
        <Typography
          variant="h5"
          component="h3"
          sx={{ textAlign: "center", mt: 1 }}
        >
          No cast information available.
        </Typography>
      )}
    </>
  );
};

export default TVSeriesDetails;

/**
 * This component has been created by cloning the movieDetails component and adjusted to ensure it would work
 * with the TVSeriesDetailsProps. Review Drawers were removed.
 */
