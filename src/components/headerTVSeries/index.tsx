import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
// import { Avatar } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { TVSeriesDetailsProps } from "../../types/interfaces";
// import { MoviesContext } from "../../contexts/moviesContext";

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

const TVSeriesHeader: React.FC<TVSeriesDetailsProps> = (series) => {
  // const context = useContext(MoviesContext);

  // if (!context) {
  //   throw new Error(
  //     "MoviesContext must be used within a MoviesContextProvider"
  //   );
  // }

  // const { favourites, mustWatchList } = context;

  // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
  // const isMustWatch = mustWatchList.some((s) => s.id === series.id);

  // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  // const isFavourite = favourites.includes(series.id);

  return (
    <Paper component="div" sx={styles.root}>
      <IconButton aria-label="go back">
        <ArrowBackIcon sx={{ color: "#8E4585" }} fontSize="large" />
      </IconButton>

      {/* {isFavourite && (
        <Avatar sx={styles.avatar}>
          <FavoriteIcon />
        </Avatar>
      )}

      {isMustWatch && (
        <Avatar sx={{ backgroundColor: "rgb(0, 128, 0)" }}>
          <PlaylistAddCheckIcon />
        </Avatar>
      )} */}

      <Typography
        variant="h4"
        component="h3"
        style={{
          paddingLeft: "2%",
          paddingRight: "2%",
          textAlign: "center",
        }}
      >
        {series.title}{" "}
        {series.homepage && (
          <a href={series.homepage}>
            <HomeIcon sx={{ color: "#8E4585" }} fontSize="large" />
          </a>
        )}
        <br />
        <span>{`${series.tagline}`} </span>
      </Typography>

      <IconButton aria-label="go forward">
        <ArrowForwardIcon sx={{ color: "#8E4585" }} fontSize="large" />
      </IconButton>
    </Paper>
  );
};

export default TVSeriesHeader;

/**
 * This component has been created by cloning the headerMovie one and making the needed adjustments to
 * work with the TVSeriesDetailsProps
 */
