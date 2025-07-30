import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import {
  BaseMovieProps,
  MovieDetailsProps,
  VideoTrailer,
} from "../../types/interfaces";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { Box, Card, CardMedia } from "@mui/material";
import { getMovieVideos } from "../../api/tmdb-api";

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
      xs: "9%",
      sm: "8%",
      md: "7%",
      lg: "6%",
    },
    right: "2%",
    bgcolor: "#8E4585",
    color: "white",
  },
};

const MovieDetails: React.FC<MovieDetailsProps> = (movie) => {
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  console.log("Cast: ", movie.cast);

  console.log(
    "Actor ids: ",
    movie.cast.map((actor) => actor.id)
  );

  const [drawerOpen, setDrawerOpen] = useState(false); // New

  // In the end you will end up with a URL like https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg.
  // https://mad9022.github.io/W2022/modules/week5/api-fetch/#the-movie-db-review
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

  /**
   * This useState hook here holds the YouTube video key of the selected movie's trailer.
   * This key is used to construct the URL for embedding the trailer in an iframe tag.
   */
  const [videoKey, setVideoKey] = useState<string>();

  /**
   * We are creating a Hero Video section with a video trailer of a movie randomly selected.
   * It will also play automatically.
   */
  const HeroVideoSection = ({
    movie,
    videoKey,
  }: {
    movie: BaseMovieProps;
    videoKey?: string;
  }) => (
    <Card
      sx={{
        position: "relative",
        height: "70vh",
      }}
    >
      {videoKey ? (
        // https://stackoverflow.com/questions/63842284/autoplay-video-in-react-material-ui-cardmedia-component
        <CardMedia
          component="iframe"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&playlist=${videoKey}`}
          title={movie.title}
          sx={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <CardMedia
          component="img"
          image={`${IMAGE_BASE}${movie.poster_path}`}
          alt={movie.title}
          title={movie.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {/* Movie Title Overlay box */}
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "1%",
          color: "white",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "1rem",
          borderRadius: "8px",
          minWidth: "20%",
        }}
      >
        <Typography variant="h4">{movie.title}</Typography>
      </Box>
    </Card>
  );

  useEffect(() => {
    const fetchData = async () => {
      /**
       * useEffect hook that runs a function as a 'side effect' after the component renders.
       * Here, it runs when `movie.id` changes, and is used to fetch the corresponding trailer video.
       */

      /**
       * Fetch the videos associated with the selected movie.
       * https://developer.themoviedb.org/reference/movie-videos
       * - Looks specifically for a "Trailer" hosted on "YouTube".
       * - If found, stores the trailer's `key` in state to be embedded later.
       */
      const videos = await getMovieVideos(movie.id);

      console.log("Videos: ", videos);

      /**
       * We then find() the specific video trailer.
       * Only trailers hosted on YouTube are valid for embedding.
       */
      const trailer = videos.find(
        (v: VideoTrailer) => v.type === "Trailer" && v.site === "YouTube"
      );

      console.log("Trailer: ", trailer);

      // We then grab the trailer 'key', as per the 'VideoTrailer' interface.
      // Could be undefined if no trailer is found, hence '?'
      setVideoKey(trailer?.key);
    };

    // Call the async function
    fetchData();
  }, [movie.id]); // Re-run if the movie changes

  return (
    <>
      <Box
        sx={{
          paddingTop: "2%",
        }}
      >
        <HeroVideoSection movie={movie} videoKey={videoKey} />
      </Box>
      {/* Overview Section */}
      <Box sx={{ paddingTop: "4%" }}>
        <Typography variant="h5" component="h3">
          {t("overview")}
        </Typography>
      </Box>

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
          label={`${movie?.revenue?.toLocaleString()}`}
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
      <Box sx={{ paddingTop: "4%" }}>
        <Typography variant="h5" component="h3">
          {t("cast")}
        </Typography>
      </Box>

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
                  label={
                    <Box
                      sx={{
                        // Allows text to wrap onto multiple lines instead of staying on a single line
                        // https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        fontWeight: "bold",
                      }}
                    >
                      {`${actor.name} (${actor.character})`}
                    </Box>
                  }
                  sx={{
                    ...styles.chipLabel,
                    py: 1, // vertical padding
                    minHeight: "3rem", // force taller chip
                  }}
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
