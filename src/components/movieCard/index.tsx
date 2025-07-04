import { useContext } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck"; // Icon for must-watch list
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from "../../images/film-poster-placeholder.png";
import { BaseMovieProps } from "../../types/interfaces";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { MoviesContext } from "../../contexts/moviesContext";

interface MovieCardProps {
  movie: BaseMovieProps; // Movie object to render
  action: (m: BaseMovieProps) => React.ReactNode; // Function passed from parent that returns interactive buttons/icons
}

// Styling configuration object for layout and icon appearance
const styles = {
  card: {
    maxWidth: 345, // Card width to keep layout consistent in grid
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

const MovieCard: React.FC<MovieCardProps> = ({ movie, action }) => {
  /**
   * The useContext hook allows a component to consume the values exposed
   * by a context provider, e.g. the addToFavorites function and favourites array.
   */
  const { favourites, mustWatchList } = useContext(MoviesContext);

  /**
   * Checks whether the current movie id exists in the favourite list,
   * which is an array of movies IDs
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
   */
  const isFavourite = favourites.includes(movie.id);

  /**
   * Checks whether the current movie exists in the must-watch list, which is
   * an array of movie objects, hence we iterate through that list and use some()
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
   */
  const isInMustWatchList = mustWatchList.some((m) => m.id === movie.id);

  return (
    // Outer container for each movie card
    <Card sx={styles.card}>
      {/* Header section includes avatar icons and movie title */}
      <CardHeader
        avatar={
          // Render one or both avatars if movie is in favorite or must-watch lists
          (isFavourite || isInMustWatchList) && (
            <div style={styles.avatarGroup}>
              {/* Render the red favorite icon avatar if movie is a favorite */}
              {isFavourite && (
                <Avatar sx={styles.avatarFavourite}>
                  <FavoriteIcon />
                </Avatar>
              )}

              {/* Render the green must-watch icon avatar if movie is in must-watch list */}
              {isInMustWatchList && (
                <Avatar sx={styles.avatarMustWatch}>
                  <PlaylistAddCheckIcon />
                </Avatar>
              )}
            </div>
          )
        }
        // Movie title displayed in header
        title={
          <Typography variant="h5" component="p">
            {movie.title}
          </Typography>
        }
      />

      {/* Movie poster section */}
      <CardMedia
        sx={styles.media}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` // TMDB image
            : img // Fallback placeholder if no image available
        }
      />

      {/* Metadata: release date and average rating */}
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <CalendarIcon fontSize="small" /> {/* Calendar icon */}
              {movie.release_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <StarRateIcon fontSize="small" /> {/* Star icon */}
              {"  "} {movie.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {/* Interactive buttons below the content area */}
      <CardActions disableSpacing>
        {action(movie)}{" "}
        {/* Action icon (e.g., "Add to must-watch") passed from parent */}
        {/* Button linking to the full movie details page */}
        <Link to={`/movies/${movie.id}`}>
          <Button variant="outlined" size="medium" color="primary">
            More Info ...
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
