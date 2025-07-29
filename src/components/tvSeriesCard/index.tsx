import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
// import Avatar from "@mui/material/Avatar";
// import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import img from "../../images/film-poster-placeholder.png";
import { BaseTVSeriesProps } from "../../types/interfaces";
// import { useContext } from "react";
// import { MoviesContext } from "../../contexts/moviesContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";

interface TVSeriesCardProps {
  series: BaseTVSeriesProps;
  action: (series: BaseTVSeriesProps) => React.ReactNode;
}

// Styling configuration object for layout and icon appearance
const styles = {
  card: {
    maxWidth: 345, // Card width to keep layout consistent in grid
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    // The transition will kick in at a reasonable speed
    // https://developer.mozilla.org/en-US/docs/Web/CSS/transition
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      // The scale() CSS function defines a transformation that resizes an element on the 2D plane.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale
      transform: "scale(1.05)",
      // we change the box Shadow property values to make it more prominent on hovering
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
      // This property will make the card stick out with a sort of the 3D effect
      cursor: "pointer",
    },
  },
  media: {
    height: 500, // Height of the movie poster image
  },
  avatarFavourite: {
    backgroundColor: "rgb(255, 0, 0)", // Red avatar background for favorite movies
    marginRight: "2%", // Small gap between avatars when both are shown
  },
  avatarMustWatch: {
    backgroundColor: "green", // Green avatar background for must-watch movies
  },
  avatarGroup: {
    display: "flex", // Display both avatars in a row
    alignItems: "center", // Vertically align avatars
  },
};

const TVSeriesCard: React.FC<TVSeriesCardProps> = ({ series, action }) => {
  // const { mustWatchList } = useContext(MoviesContext);
  // const isInMustWatchList = mustWatchList.some((m) => m.id === series.id);

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  return (
    <Card sx={styles.card}>
      <CardHeader
        //  avatar={
        // isInMustWatchList && (
        // <Avatar sx={styles.avatarMustWatch}>
        //   <PlaylistAddCheckIcon />
        // </Avatar>
        // )
        // }
        title={
          <Typography variant="h5" component="p">
            {series.name}
          </Typography>
        }
      />

      <CardMedia
        sx={styles.media}
        image={
          series.poster_path
            ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
            : img
        }
      />

      <CardContent>
        <Grid container>
          <Grid item xs={8}>
            <Typography
              variant="h6"
              component="p"
              display="flex"
              alignItems="center"
            >
              <CalendarIcon fontSize="small" sx={{ marginRight: 0.5 }} />
              {/* 
              `toLocaleDateString()` method.
              Converts date string from `series.first_air_date` into a human-readable, 
              localized string using the browser's locale settings. 
              https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString 
              */}
              {new Date(series.first_air_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h6"
              component="p"
              display="flex"
              alignItems="center"
            >
              <StarRateIcon fontSize="small" />
              {series.vote_average}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions disableSpacing>
        {action(series)}
        <Link to={`/tvseries/${series.id}`}>
          <Button variant="outlined" size="medium" sx={{ color: "#8E4585" }}>
            {/* color="primary"  */}
            {/* More Info ... */}
            {t("more_info")}
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default TVSeriesCard;

/**
 * This TV Series Card component has been built up as a clone of the Movie Card one and adapted to
 * be used with the 'series' list.
 */
