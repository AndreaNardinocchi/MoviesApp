import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTemplate from "../components/templateMovieListPage";
import { fetchActorDetails, getActorMovies } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { BaseMovieProps } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import MovieFilterUI, {
  genreFilter,
  releaseFilter,
  titleFilter,
} from "../components/movieFilterUI";
import useFiltering from "../hooks/useFiltering";
// import i18n from "../i18n/i18n";

// Define the default filter state for title filtering
const titleFiltering = {
  name: "title",
  value: "", // Start with no filter applied
  condition: titleFilter, // The actual filter function
};

// Define the default filter state for genre filtering
const genreFiltering = {
  name: "genre",
  value: "0", // "0" typically means "All genres"
  condition: genreFilter, // The actual filter function
};

// Define the default filter state for release filtering
const releaseFiltering = {
  name: "release",
  value: 0, // 0 = show all years and MUST be a number, otherwise it won't show any movies
  condition: releaseFilter,
};

const ActorMoviesPage: React.FC = () => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();

  const lang = i18n.language || "en-US";
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  // Extract the 'id' parameter from the URL using React Router's useParams hook
  const { movieId, actorId } = useParams() as {
    movieId: string;
    actorId: string;
  };

  // Create the state for 'sortOrder' and set to newest first
  const [sortOrder, setSortOrder] = useState("desc");

  // Set up filtering state and logic using the custom `useFiltering` hook
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  // Fetch movie data using React Query's useQuery hook
  const {
    data: movies,
    error,
    isLoading,
    isError,
  } = useQuery<BaseMovieProps[], Error>(
    ["actorMovies", actorId, lang],
    // Fetch the movie with cast information using the provided function
    () => getActorMovies(actorId || "", lang)
  );

  // Fetch movie data using React Query's useQuery hook
  const { data: actorDetails } = useQuery(
    ["actorDetails", actorId, lang],
    // Fetch the movie with cast information using the provided function
    () => fetchActorDetails(actorId || "", lang)
  );

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("actor_movies_header")}  ${
      actorDetails?.name
    }  | MovieApp`;
  }, [t, actorDetails?.name]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  if (!movies) return <h2>{t("actor_no_movies")}</h2>;

  /**
   * We use `movies.results` here because the API response `movies`
   * is an object containing metadata like `page` and `total_pages`,
   * and the actual array of movie objects is inside the `results` property.
   * The API function has been updated to return response.json();, otherwise
   * the pagination would not work
   */
  // const displayedMovies = movies?.results ? filterFunction(movies.results) : [];

  const displayedMovies = movies ? filterFunction(movies) : [];

  // Add sorting by release date
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // https://stackoverflow.com/questions/74242074/sorting-array-of-objects-by-iso-date?
  displayedMovies.sort(
    (a: { release_date: string }, b: { release_date: string }) => {
      if (!a.release_date || !b.release_date) return 0;

      return sortOrder === "asc"
        ? a.release_date.localeCompare(b.release_date)
        : b.release_date.localeCompare(a.release_date);
    }
  );

  // Called when the user changes title, genre filter, release year, and sort
  const changeFilterValues = (type: string, value: string) => {
    if (type === "sort") {
      /**
       * Sort is managed by its own state sortOrder, not in the filterValues array.
       * So we update the sort order separately and exit early to skip the rest of the filter logic.
       * */
      setSortOrder(value);
      /**
       * So, by returning early, we make sure only setSortOrder is called,
       * and we avoid mistakenly trying to update filter state with an invalid type.
       */
      return;
    }
    /**
     * After After filtering, we sort the already 'filtered movies' by their release_date,
     * depending on the sortOrder selected by the user.
     * If sortOrder is 'asc', compare a to b (oldest first)
     * If sortOrder is 'desc', compare b to a (newest first)
     * */
    const changedFilter = { name: type, value };
    const updatedFilterSet =
      /**
       * If type === "title", update the first filter.
       * Otherwise, if type === "genre", update the second filter.
       * Otherwise, type === "release", update the third filter.
       */
      type === "title"
        ? [changedFilter, filterValues[1], filterValues[2]]
        : type === "genre"
        ? [filterValues[0], changedFilter, filterValues[2]]
        : [filterValues[0], filterValues[1], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  return (
    <>
      <PageTemplate
        title={`${t("actor_movies_header")} ${actorDetails?.name}`}
        movies={displayedMovies}
        action={(movie: BaseMovieProps) => {
          return <AddToFavouritesIcon {...movie} />;
        }}
      />

      {/* Sticky Bar */}
      {/* https://mui.com/system/react-box/ */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.06)",
          display: "flex", // Use flexbox
          justifyContent: "flex-start", // Push content to the left
          alignItems: "center", // Vertically center the content
          padding: {
            xs: "3% 4%", // small devices
            sm: "2% 1.8%", // tablets
            md: "1.5% 1.0%", // medium screens
            lg: "0.7% 0.8%", // large screens
          },
        }}
      >
        <Link
          to={`/movies/${movieId}/actor/${actorId}`}
          style={{
            textDecoration: "none",
            color: "#8E4585",
            fontWeight: "bold",
            textAlign: "right",
          }}
        >
          ← {t("back_to_actor_page")} {actorDetails?.name}
        </Link>
      </Box>
      {/* Render the title/genre filtering UI BELOW the movie list */}
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        // This is NOT a string, so we wrap it with a Number()
        releaseFilter={Number(filterValues[2].value)}
        sortOrder={sortOrder}
      />
    </>
  );
};

export default ActorMoviesPage;
