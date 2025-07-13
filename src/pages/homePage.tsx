import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getMovieVideos, getMovies } from "../api/tmdb-api";
import { useTranslation } from "react-i18next";
import { BaseMovieProps, VideoTrailer } from "../types/interfaces";
// https://mui.com/material-ui/api/card-media/
import { Box, Card, CardMedia, Typography } from "@mui/material";

// In the end you will end up with a URL like https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg.
// https://mad9022.github.io/W2022/modules/week5/api-fetch/#the-movie-db-review
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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
  <Card sx={{ position: "relative", height: "70vh" }}>
    {videoKey ? (
      // https://stackoverflow.com/questions/63842284/autoplay-video-in-react-material-ui-cardmedia-component
      <CardMedia
        component="iframe"
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&loop=1&playlist=${videoKey}`}
        title={movie.title}
        sx={{ width: "100%", height: "100%", border: "none" }}
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    ) : (
      <CardMedia
        component="img"
        image={`${IMAGE_BASE}${movie.poster_path}`}
        alt={movie.title}
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
        width: "20%",
      }}
    >
      <Typography variant="h3">{movie.title}</Typography>
    </Box>
  </Card>
);

const HomePage: React.FC = () => {
  /** 
       * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
       If undefined or empty, fallback to 'en-US'
       */
  const { i18n } = useTranslation();

  const lang = i18n.language || "en-US";

  // Log the current languag
  console.log("Current i18n language:", i18n.language);
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  /**
   * We are setting the state for page as '1' as we want to show the first page first
   * https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3
   */
  const [page, setPage] = useState(1);

  /**
   * The useState hook here allows function components to manage local component state. It returns the current
   * state value, and a setter function to update that value. When the setter function is called, the component
   * re-renders with the new state. This is initially set to null until a movie is randomly selected via the 'random'
   * funtion in the below useEffect()
   */
  const [randomMovie, setRandomMovie] = useState<BaseMovieProps | null>(null);

  /**
   * This useState hook here holds the YouTube video key of the selected movie's trailer.
   * This key is used to construct the URL for embedding the trailer in an iframe tag.
   */
  const [videoKey, setVideoKey] = useState<string>();

  // Fetch movies with React Query
  // The below code has bee slighly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3
  const { data, error, isLoading, isError } = useQuery(
    ["test", page, lang],
    () => getMovies(page, lang),
    {
      keepPreviousData: true,
    }
  );

  // When movies are fetched, pick one randomly and fetch its trailer

  useEffect(() => {
    /**
     * useEffect hook that runs a function as a 'side effect' after the component renders.
     * Here, it runs when `data` changes, and is used to select a random movie from the fetched data,
     * which is the corresponding trailer video for that movie.
     */

    // If `data` or `data.results` exits as per  results: BaseMovieProps[]; in the DiscoverMovies interface
    if (data?.results?.length) {
      /**
       * Select a random movie from the results array.
       * This ensures variety every time the data changes (e.g. on language/page change).
       * The Math.floor() static method always rounds down and returns the largest integer less than or equal to a given number.
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
       * The Math.random() static method returns a floating-point, pseudo-random number that's greater than or equal to 0 and less than 1,
       * with approximately uniform distribution over that range — which you can then scale to your desired range.
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#examples
       * https://dev.to/kanaga_vimala_66acce9cf6e/understanding-mathrandom-mathfloor-and-arrays-in-javascript-mkl
       */

      const randomFunction = Math.floor(Math.random() * data.results.length);
      const randomMovie = data.results[randomFunction];

      // Save the selected random movie to local state.
      setRandomMovie(randomMovie);

      /**
       * Fetch the videos associated with the selected movie.".then()" here is used to
       * access the results array.
       * https://github.com/grantholle/moviedb-promise/blob/main/README.md?
       * - Looks specifically for a "Trailer" hosted on "YouTube".
       * - If found, stores the trailer's `key` in state to be embedded later.
       */
      getMovieVideos(randomMovie.id).then((videos) => {
        /**
         * We then find() the specific video trailer
         * https://developer.themoviedb.org/reference/movie-videos
         * https://www.themoviedb.org/talk/62db7e45ea84c7004fc5a8c7?
         */
        const trailer = videos.find(
          (v: VideoTrailer) => v.type === "Trailer" && v.site === "YouTube"
        );
        // We then grab the trailer 'key', as per the 'VideoTrailer' interface.
        // Could be undefined if no trailer is found, hence '?'
        setVideoKey(trailer?.key);
      });
    }
  }, [data]); // Re-run the effect whenever `data` changes.

  if (isLoading) return <p>Loading movies...</p>;
  if (isError) return <p>Error loading movies: {(error as Error).message}</p>;

  return (
    <div>
      {randomMovie && (
        <HeroVideoSection movie={randomMovie} videoKey={videoKey} />
      )}
    </div>
  );
};

export default HomePage;

// IN PROGRESS ** THIS IS THE NEW HOMEPAGE //
