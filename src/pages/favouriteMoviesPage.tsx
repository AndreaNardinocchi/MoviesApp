import React, { useContext, useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  releaseFilter,
} from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";
import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";

/**
 * The Favourite movies page can use the favourite movie ids to fetch the movie details from TMDB
 */

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};

const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

// Define the default filter state for release filtering
const releaseFiltering = {
  name: "release",
  value: "0",
  condition: releaseFilter,
};

const FavouriteMoviesPage: React.FC = () => {
  /** 
       *Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
       If undefined or empty, fallback to 'en-US'
       */
  const { i18n } = useTranslation();

  const lang = i18n.language || "en-US";
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("favorites_movies")} | MovieApp`;
  }, [t]);

  // Create the state for 'sortOrder' and set to newest first
  const [sortOrder, setSortOrder] = useState("desc");

  const { favourites: movieIds } = useContext(MoviesContext);
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  // Create an array of queries and run them in parallel.
  // If we already have the list of movie IDs and want to fetch each movie individually
  const favouriteMovieQueries = useQueries(
    movieIds.map((movieId) => {
      return {
        // By adding the 'lang' parameter, we noe fetch 'in-language' favourites
        queryKey: ["movie", movieId, lang],
        queryFn: () => getMovie(movieId.toString(), lang),
      };
    })
  );

  // Check if any of the parallel queries is still loading.
  const isLoading = favouriteMovieQueries.find((m) => m.isLoading === true);

  if (isLoading) {
    return <Spinner />;
  }

  /**
   * Extract all movie data from the array of favourite queries.
   * Each element is the `data` field from a React Query result object.
   */
  const allFavourites = favouriteMovieQueries.map((q) => q.data);

  /**
   * Normalize all favourite movies into a consistent structure.
   * This ensures that each movie has `genre_ids`, even if originally only `genres` was provided,
   * and filters out any 'null/undefined' entries.
   */
  const normalizedMovies = allFavourites
    .map((movie) => {
      if (!movie) return null;

      // If genre_ids already exist, return movie as is
      if (movie.genre_ids) {
        return movie;
      }

      /**
       * If the movie only has `genres` (array of { id, name }),
       * extract the numeric genre_ids using optional chaining.
       * If `genres` is missing or not an array, default to an empty array.
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
       */
      const genre_ids = movie.genres?.map((g: { id: number }) => g.id) ?? [];

      // Return a new movie object with genre_ids added
      return {
        ...movie,
        genre_ids,
      };
    })
    .filter(Boolean); // remove any null entries safely
  /**
   * PS* Boolean values are typically used in conditional testing, such as the condition for if...else and while statements,
   * the conditional operator (? :), or the predicate return value of Array.prototype.filter().
   * You would rarely need to explicitly convert something to a boolean value, as JavaScript does this automatically in
   * boolean contexts, so you can use any value as if it's a boolean, based on its truthiness.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
   */

  // Apply filters (title, genre, release year) to the normalized movie list.
  const displayedMovies = normalizedMovies
    ? filterFunction(normalizedMovies)
    : [];

  /**
   * We use the spread operator now to create a shallow copy of 'displayedTVSeries'
   * before sorting because `.sort()` changes the original array in place, whereas the spread
   * operator ensure we only create that shallow copy and won't modify the original array.
   * Without spread operator, the sort() function was actually creating duplicates for certain
   * movies. This ensures we don't modify the original filtered list,
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   * https://stackoverflow.com/questions/74242074/sorting-array-of-objects-by-iso-date?
   * */
  const sortedDisplayedMovies = [...displayedMovies].sort((a, b) => {
    if (!a.release_date || !b.release_date) return 0;
    /**
     * We sort the already 'filtered movies' by their release_date,
     * depending on the sortOrder selected by the user.
     * If sortOrder is 'asc', compare a to b (oldest first)
     * If sortOrder is 'desc', compare b to a (newest first)
     * */
    return sortOrder === "asc"
      ? a.release_date.localeCompare(b.release_date)
      : b.release_date.localeCompare(a.release_date);
  });

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
        title={t("favorites_movies")}
        movies={sortedDisplayedMovies}
        action={(movie) => {
          return (
            <>
              <RemoveFromFavourites {...movie} />
              <WriteReview {...movie} />
            </>
          );
        }}
      />

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

export default FavouriteMoviesPage;

/**
 * Note, TMDB returns a different object structure for a movie when asked for a list of movies
 * rather than details of a particular movie. For this reason, the genre filtering condition is
 * different for the Favourites page as opposed to the home page.
 */
