import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import { MovieDetailsProps } from "../../types/interfaces";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";

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
  fab: {
    marginTop: "2%",
    position: "fixed",
    top: {
      xs: "8%",
      sm: "6%",
      md: "5%",
      lg: "4%",
    },
    right: "2%",
    bgcolor: "#8E4585",
    color: "white",
  },
};

const MovieDetails: React.FC<MovieDetailsProps> = (movie) => {
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const [drawerOpen, setDrawerOpen] = useState(false); // New

  return (
    <>
      {/* Overview Section */}
      <Typography variant="h5" component="h3">
        {t("overview")}
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>
      {/* Genres Section */}
      <Paper component="ul" sx={styles.chipSet}>
        <li>
          <Chip
            label={t("genres")}
            sx={{
              // Spread styles.chipLabel keeps the original chip styling
              ...styles.chipLabel,
              bgcolor: "#8E4585",
              color: "#ffffff",
            }}
          />
        </li>
        {movie.genres?.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} />
          </li>
        ))}
      </Paper>

      {/* Runtime, Revenue, Rating, Release Date */}
      <Paper component="ul" sx={styles.chipSet}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip
          icon={<MonetizationIcon />}
          label={`${movie.revenue.toLocaleString()}`}
        />
        <Chip
          icon={<StarRate />}
          label={`${movie.vote_average} (${movie.vote_count}`}
        />
        <Chip label={`${t("release")}: ${movie.release_date}`} />
      </Paper>

      {/* Production Countries */}
      <Paper component="ul" sx={styles.chipSet}>
        <li>
          <Chip
            label={t("production_countries")}
            sx={{
              // Spread styles.chipLabel keeps the original chip styling
              ...styles.chipLabel,
              bgcolor: "#8E4585",
              color: "#ffffff",
            }}
          />
        </li>
        {movie.production_countries?.map((country) => (
          <li key={country.name}>
            <Chip label={country.name} />
          </li>
        ))}
      </Paper>

      {/* Cast Section */}
      <Typography variant="h5" component="h3">
        {t("cast")}
      </Typography>

      {/*
      To safely handle the movie.cast potentially being undefined or empty, we are using
      Array.isArray to avoid '.length' checks on possibly undefined values.
      It ensures it’s a valid array before accessing .length or using .map()
      Only render cast list if it's a valid non-empty array.
      https://www.geeksforgeeks.org/typescript-array-isarray-method/?utm_source=chatgpt.com
      */}
      {Array.isArray(movie.cast) && movie.cast.length > 0 ? (
        <Paper component="ul" sx={styles.chipSet}>
          {movie.cast.map((actor) => (
            <li key={actor.id}>
              <Link
                to={`/movies/${movie.id}/actor/${actor.id}`} // URL path for the actor page
                state={{ actor: actor, movie: movie }} // Pass actor and movie data as navigation state
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
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 1 }}
        >
          No cast information available.
        </Typography>
      )}

      {/* Reviews Drawer */}
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          // Spread the base fab styles defined earlier
          ...styles.fab,
          // https://mui.com/system/getting-started/the-sx-prop/?
          "&:hover": {
            // Text color on hover
            color: "#000000",
            // Change background slightly on hover
            bgcolor: "#ffe6f0",
          },
        }}
      >
        <NavigationIcon />
        {t("reviews")}
      </Fab>
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <MovieReviews {...movie} />
      </Drawer>
    </>
  );
};

export default MovieDetails;
