import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import TemplateTVSeriesPage from "../components/templateTVSeriesPage";
import TVSeriesDetails from "../components/TVSeriesDetails";
import { getTVSeries, getTVSeriesCredits } from "../api/tmdb-api";
import { TVSeriesDetailsProps } from "../types/interfaces";

/**
 * ====== Fetch TVSeries details + cast info ==========
 * Combines two API calls:
 * getTVSeries - fetches basic movie data (title, overview, genres, etc.)
 * getTVSeriesCredits - fetches the cast/actor list
 * The returned object for the function 'fetchMovieWithCast' merges the cast into the TV Series details object
 * to be passed as a single prop to components that need both sets of info.
 */
const fetchTVSeriesWithCast = async (
  id: string
): Promise<TVSeriesDetailsProps> => {
  const series = await getTVSeries(id);
  const cast = await getTVSeriesCredits(id);
  return {
    /**
     * The spread operator '...series' copies all enumerable properties from the 'series' object
     * into this new object. This means all movie details like title, overview, release date, etc.
     * are included here without needing to manually list each property.
     * */
    ...series,
    cast,
    title: series.name, // normalize title for UI use
  };
};

/**
 * A common source of errors with React apps is a component/page renders before the data it needs is retrieved from the backend API
 * - the initial rendering happens before the useEffect hook completes. This scenario applies to MovieDetailsPage.
 * The solution is to have a condition test in the TSX code that checks the availability of the API data.
 * If available, it displays it, otherwise an appropriate message displays.
 * In the below code, the ternary operator performs the condition test.
 * movie ? display data : display message
 */
const TVSeriesDetailsPage: React.FC = () => {
  // Extract the 'id' parameter from the URL using React Router's useParams hook
  const { id } = useParams();
  // Fetches TV series details and cast using React Query
  const {
    data: series, // The fetched series data will be stored in 'series'
    error, // Error object if the query fails
    isLoading, // Boolean flag indicating if the query is currently loading
    isError, // Boolean flag indicating if there was an error during the query
  } = useQuery<TVSeriesDetailsProps, Error>(
    ["tvseries", id], // Unique query key for caching and refetching
    () =>
      // Fetch the TV Series with cast information using the provided function
      fetchTVSeriesWithCast(id || "")
  );

  if (isLoading) return <Spinner />;

  if (isError) return <h1>{(error as Error).message}</h1>;

  return (
    <>
      {series ? (
        <>
          <TemplateTVSeriesPage series={series}>
            {/* Passes all series props (e.g., title, genres, cast) to the details component */}
            <TVSeriesDetails {...series} />
          </TemplateTVSeriesPage>
        </>
      ) : (
        <p>Waiting for TV Series details</p>
      )}
    </>
  );
};

export default TVSeriesDetailsPage;

// This page was creating by cloning the movieDetailsPage and adjusting it
// by passing the TV series array instead of the movies'
