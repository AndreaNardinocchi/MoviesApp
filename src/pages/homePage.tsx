import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { getMovieVideos, getMovies, getUpcomingMovies } from "../api/tmdb-api";
import { useTranslation } from "react-i18next";
import { BaseMovieProps, VideoTrailer } from "../types/interfaces";
// https://mui.com/material-ui/api/card-media/
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
// https://mui.com/material-ui/material-icons/?selected=VideoCameraFront
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import Arrow from "../components/arrow";

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
        minWidth: "20%",
      }}
    >
      <Typography variant="h4">{movie.title}</Typography>
    </Box>
  </Card>
);

/**
 * We are creating a Movie Carousel to display movie cards in a row, and be able to
 * scroll through and click on them.
 *
 */
const MovieCarouselDiscover = ({
  title,
  movies,
  onCardClick,
}: {
  title: string;
  movies: BaseMovieProps[];
  // We pass the BaseMovieProp to the onCardClick function
  onCardClick: (movie: BaseMovieProps) => void;
}) => {
  /**
   * useRef is a hook useRef that associates a DOM element with it, in this case a <div>
   * It is basically used to manipulate the DOM element, and, it is initially set to null
   * until the component mounts.
   * After the component mounts and React renders the DOM node with ref={scrollRef}:
   * https://atomizedobjects.com/blog/react/how-to-use-useref-in-react/
   * https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b
   * https://tj.ie/scrollable-container-controls-with-react-hooks/?
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Programmatically scrolls the referenced div left or right by 80% of its visible width.
   * The parameter 'dir' is a string that indicates the direction of the scroll.
   */
  const scroll = (dir: "left" | "right") => {
    /**
     * The '.current' property holds a reference to the actual DOM element, once React assigns it
     */
    if (scrollRef.current) {
      /**
       * Calculate how far to scroll.
       * This uses 80% of the current width of the container to create a responsive scroll effect.
       * 'ClientWidth' returns the width of an HTML element including padding in pixels,
       * but does not include margin, border and scrollbar width.
       * https://www.geeksforgeeks.org/css/offsetwidth-clientwidth-scrollwidth-and-height-respectively-in-css/
       */
      const scrollAmount = scrollRef.current.clientWidth * 0.955;

      /**
       * Scroll the container horizontally using scrollBy().
       * If the direction is "left", scroll by a negative value.
       * If the direction is "right", scroll by a positive value.
       * The scroll behavior is set to "smooth" for animated scrolling.
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy?
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy?#behavior
       */
      scrollRef.current.scrollBy({
        // If dir is left scroll negatively, otherwise positively
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <Box sx={{ position: "relative", my: 4, px: "3%" }}>
      <Typography variant="h5" sx={{ mb: 2, pl: 2, fontSize: "200%" }}>
        {title}
      </Typography>

      {/* Arrows for scrolling */}

      <Arrow direction="left" clickFunction={() => scroll("left")} />

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          // CSS pseudo-element affects the style of an element's scrollbar when it has scrollable overflow.
          // In this case, we do not want to have a scrollbar showing
          // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
          "&::-webkit-scrollbar": { display: "none" },
          gap: 2,
          px: 2,
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            sx={{
              // We apply appropriate width based on the device size to make the cards responsive
              // https://medium.com/%40mahdidarzi1024/understanding-frontend-breakpoints-and-why-muis-defaults-are-perfectly-fine-04f6f52476cd?
              width: {
                xs: "100%", // 1 card per row on mobile
                sm: "48%", // 2 cards on small tablets
                md: "32%", // 3 cards on medium screens
                lg: "20%", // 4 cards on large screens
              },
              // minWidth: "2%",
              flex: "0 0 auto",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Link
              to={`/movies/${movie.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CardActionArea onClick={() => onCardClick(movie)}>
                <CardMedia
                  component="img"
                  image={
                    // If the poster_path exists, than we use the full URL ${IMAGE_BASE}${movie.poster_path},
                    // otherwise, it is undefined
                    movie.poster_path
                      ? `${IMAGE_BASE}${movie.poster_path}`
                      : undefined
                  }
                  alt={movie.title}
                  sx={{ height: "100%" }}
                />
                <CardContent>
                  <Typography variant="body1" sx={{ fontSize: "140%" }} noWrap>
                    {movie.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        ))}
      </Box>
      <Arrow direction="right" clickFunction={() => scroll("right")} />
    </Box>
  );
};

/**
 * We are creating a Movie Carousel to display movie cards in a row, and be able to
 * scroll through and click on them.
 *
 */
const MovieCarouselUpcoming = ({
  title,
  movies,
  onCardClick,
}: {
  title: string;
  movies: BaseMovieProps[];
  // We pass the BaseMovieProp to the onCardClick function
  onCardClick: (movie: BaseMovieProps) => void;
}) => {
  /**
   * useRef is a hook useRef that associates a DOM element with it, in this case a <div>
   * It is basically used to manipulate the DOM element, and, it is initially set to null
   * until the component mounts.
   * After the component mounts and React renders the DOM node with ref={scrollRef}:
   * https://atomizedobjects.com/blog/react/how-to-use-useref-in-react/
   * https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b
   * https://tj.ie/scrollable-container-controls-with-react-hooks/?
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Programmatically scrolls the referenced div left or right by 80% of its visible width.
   * The parameter 'dir' is a string that indicates the direction of the scroll.
   */
  const scroll = (dir: "left" | "right") => {
    /**
     * The '.current' property holds a reference to the actual DOM element, once React assigns it
     */
    if (scrollRef.current) {
      /**
       * Calculate how far to scroll.
       * This uses 80% of the current width of the container to create a responsive scroll effect.
       * 'ClientWidth' returns the width of an HTML element including padding in pixels,
       * but does not include margin, border and scrollbar width.
       * https://www.geeksforgeeks.org/css/offsetwidth-clientwidth-scrollwidth-and-height-respectively-in-css/
       */
      const scrollAmount = scrollRef.current.clientWidth * 0.955;

      /**
       * Scroll the container horizontally using scrollBy().
       * If the direction is "left", scroll by a negative value.
       * If the direction is "right", scroll by a positive value.
       * The scroll behavior is set to "smooth" for animated scrolling.
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy?
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy?#behavior
       */
      scrollRef.current.scrollBy({
        // If dir is left scroll negatively, otherwise positively
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <Box sx={{ position: "relative", my: 4, px: "3%" }}>
      <Typography variant="h5" sx={{ mb: 2, pl: 2, fontSize: "200%" }}>
        {title}
      </Typography>

      {/* Arrows for scrolling */}

      <Arrow direction="left" clickFunction={() => scroll("left")} />

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          // CSS pseudo-element affects the style of an element's scrollbar when it has scrollable overflow.
          // In this case, we do not want to have a scrollbar showing
          // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
          "&::-webkit-scrollbar": { display: "none" },
          gap: 2,
          px: 2,
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            sx={{
              // We apply appropriate width based on the device size to make the cards responsive
              // https://medium.com/%40mahdidarzi1024/understanding-frontend-breakpoints-and-why-muis-defaults-are-perfectly-fine-04f6f52476cd?
              width: {
                xs: "100%", // 1 card per row on mobile
                sm: "48%", // 2 cards on small tablets
                md: "32%", // 3 cards on medium screens
                lg: "20%", // 4 cards on large screens
              },
              // minWidth: "2%",
              flex: "0 0 auto",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Link
              to={`/movies/${movie.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CardActionArea onClick={() => onCardClick(movie)}>
                <CardMedia
                  component="img"
                  image={
                    // If the poster_path exists, than we use the full URL ${IMAGE_BASE}${movie.poster_path},
                    // otherwise, it is undefined
                    movie.poster_path
                      ? `${IMAGE_BASE}${movie.poster_path}`
                      : undefined
                  }
                  alt={movie.title}
                  sx={{ height: "100%" }}
                />
                <CardContent>
                  <Typography variant="body1" sx={{ fontSize: "140%" }} noWrap>
                    {movie.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>
          </Card>
        ))}
      </Box>
      <Arrow direction="right" clickFunction={() => scroll("right")} />
    </Box>
  );
};

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
  /**
   * This useState hook here set the discovery movies array, and  it will be populated after
   * calling the `getMovies()` API. The `BaseMovieProps[]` type ensures that each movie
   * object in the array follows the expected movie data.
   */
  const [discoverMovies, setDiscoverMovies] = useState<BaseMovieProps[]>([]);

  /**
   * This useState hook here set the upcoming movies array, and  it will be populated after
   * calling the `getUpcomingMovies()` API. The `BaseMovieProps[]` type ensures that each movie
   * object in the array follows the expected movie data.
   */
  const [upcomingMovies, setUpcomingMovies] = useState<BaseMovieProps[]>([]);

  // Fetch movies with React Query
  // The below code has bee slighly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3
  const { data, error, isLoading, isError } = useQuery(
    ["homePage", page, lang],
    () => getMovies(page, lang),
    {
      keepPreviousData: true,
    }
  );

  // When movies are fetched, pick one randomly and fetch its trailer
  useEffect(() => {
    const fetchData = async () => {
      /**
       * useEffect hook that runs a function as a 'side effect' after the component renders.
       * Here, it runs when `data` changes, and is used to select a random movie from the fetched data,
       * which is the corresponding trailer video for that movie.
       */

      // If `data` or `data.results` exists as per  results: BaseMovieProps[]; in the DiscoverMovies interface
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

        // We create a const discover and fetch the movies via the API function
        const discover = await getMovies(page, lang);
        setDiscoverMovies(discover.results);

        // We create a const upcoming and fetch the movies via the API function
        const upcoming = await getUpcomingMovies(page, lang);
        setUpcomingMovies(upcoming.results);

        /**
         * Fetch the videos associated with the selected movie.
         * https://github.com/grantholle/moviedb-promise/blob/main/README.md?
         * - Looks specifically for a "Trailer" hosted on "YouTube".
         * - If found, stores the trailer's `key` in state to be embedded later.
         */
        const videos = await getMovieVideos(randomMovie.id);

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
      }
    };
    // Call the async function
    fetchData();
  }, [data, page, lang]); // Re-run the effect whenever `data`, `page`, or `lang` change

  if (isLoading) return <p>Loading movies...</p>;
  if (isError) return <p>Error loading movies: {(error as Error).message}</p>;

  return (
    <div>
      {randomMovie && (
        <HeroVideoSection movie={randomMovie} videoKey={videoKey} />
      )}
      <Grid
        container
        spacing={2}
        sx={{ padding: "5% 5% 0 5%", textAlign: "center" }}
      >
        <Grid item xs={12}>
          <Typography variant="h2">
            <VideoCameraFrontIcon
              // fontSize="small"
              color="inherit"
              sx={{
                marginTop: 0.03,
                verticalAlign: "middle",
                mr: 0.3,
                fontSize: "150%",
              }}
            />
            MovieApp{" "}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "180%" }}>
            {t("all_you_ever_wanted")}
          </Typography>
        </Grid>
      </Grid>

      <MovieCarouselDiscover
        title={t("discover_movies")}
        movies={discoverMovies}
        onCardClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
      <MovieCarouselUpcoming
        title={t("upcoming_movies")}
        movies={upcomingMovies}
        onCardClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default HomePage;

// IN PROGRESS ** THIS IS THE NEW HOMEPAGE //
