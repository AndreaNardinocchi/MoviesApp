import React from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRate from "@mui/icons-material/StarRate";
import Typography from "@mui/material/Typography";
import { TVSeriesDetailsProps } from "../../types/interfaces";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import TopicIcon from "@mui/icons-material/Topic";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { Box } from "@mui/material";

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
  right: "2%",
  bgcolor: "#8E4585",
  color: "white",
};

const TVSeriesDetails: React.FC<TVSeriesDetailsProps> = (series) => {
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);
  console.log(
    "Current language and series.overview:",
    i18n.language,
    series.overview
  );

  return (
    <>
      {/* Overview */}
      <Typography variant="h5" component="h3">
        {t("overview")}
      </Typography>
      <Typography variant="h6" component="p">
        {series.overview}
      </Typography>

      {/* Genres */}
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
        {series.genres?.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} />
          </li>
        ))}
      </Paper>

      {/* Runtime, Seasons, Episodes, Rating, First Air Date */}
      <Paper component="ul" sx={styles.chipSet}>
        <Chip
          icon={<TopicIcon />}
          label={`${t("seasons")}: ${series.number_of_seasons}`}
        />
        <Chip
          icon={<PlaylistPlayIcon />}
          label={`${t("episodes")}: ${series.number_of_episodes}`}
        />
        <Chip icon={<StarRate />} label={`${series.vote_average}`} />
        <Chip label={`${t("first_aired")}: ${series.first_air_date}`} />
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
        {series.production_countries?.map((country) => (
          <li key={country.name}>
            <Chip label={country.name} />
          </li>
        ))}
      </Paper>

      {/* Cast */}
      <Typography variant="h5" component="h3">
        {t("cast")}
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
                to={`/tvseries/${series.id}/actor/${actor.id}`} // URL path for the actor page
                state={{ actor: actor, series: series }} // Pass actor and series data as navigation state
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
    </>
  );
};

export default TVSeriesDetails;

/**
 * This component has been created by cloning the movieDetails component and adjusted to ensure it would work
 * with the TVSeriesDetailsProps. Review Drawers were removed.
 */
