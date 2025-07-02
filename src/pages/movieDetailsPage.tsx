import React from "react"; // replace existing react import
import { useParams } from "react-router-dom";
import MovieDetails from "../components/movieDetails";
import PageTemplate from "../components/templateMoviePage";
// import useMovie from "../hooks/useMovie";   Redundant
import { getMovie, getMovieCredits } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import { MovieDetailsProps } from "../types/interfaces";

/**
 * ====== Fetch movie details + cast info ==========
 * Combines two API calls:
 * getMovie - fetches basic movie data (title, overview, genres, etc.)
 * getMovieCredits - fetches the cast/actor list
 * The returned object for the function 'fetchMovieWithCast' merges the cast into the movie details object
 * to be passed as a single prop to components that need both sets of info.
 *
 *
 */
const fetchMovieWithCast = async (id: string): Promise<MovieDetailsProps> => {
  const movie = await getMovie(id);
  const cast = await getMovieCredits(id); // Fetch actors

  return {
    /**
     * The spread operator '...movie' copies all enumerable properties from the 'movie' object
     * into this new object. This means all movie details like title, overview, release date, etc.
     * are included here without needing to manually list each property.
     * */
    ...movie,
    cast,
  }; // Attach cast to movie object
};

/**
 * A common source of errors with React apps is a component/page renders before the data it needs is retrieved from the backend API
 * - the initial rendering happens before the useEffect hook completes. This scenario applies to MovieDetailsPage.
 * The solution is to have a condition test in the TSX code that checks the availability of the API data.
 * If available, it displays it, otherwise an appropriate message displays.
 * In the below code, the ternary operator performs the condition test.
 * movie ? display data : display message
 */

const MovieDetailsPage: React.FC = () => {
  // Extract the 'id' parameter from the URL using React Router's useParams hook
  const { id } = useParams();
  // Fetch movie data (including cast details) using React Query's useQuery hook
  const {
    data: movie, // The fetched movie data will be stored in 'movie'
    error, // Error object if the query fails
    isLoading, // Boolean flag indicating if the query is currently loading
    isError, // Boolean flag indicating if there was an error during the query
  } = useQuery<MovieDetailsProps, Error>(
    ["movie", id], // Unique query key for caching and refetching
    () =>
      // Fetch the movie with cast information using the provided function
      fetchMovieWithCast(id || "")
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
            {/* Passes all movies props (e.g., title, genres, cast) to the details component */}
            <MovieDetails {...movie} />
          </PageTemplate>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MovieDetailsPage;

/**
 * This page component no longer has the useState and useEffect hooks;
 * they have moved to our custom hook. Check the page still works.
 * The useMovie.ts was throwing'Invalid hook' error when opening pages like the UpcomingMovies one
 */
