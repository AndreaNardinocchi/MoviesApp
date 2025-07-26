import React, { useEffect, useState } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
  releaseFilter,
} from "../components/movieFilterUI";
import { BaseMovieProps, DiscoverMovies } from "../types/interfaces";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
// https://mui.com/material-ui/react-pagination/
import { Pagination } from "@mui/material";
import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";

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

const DiscoverMoviesPage: React.FC = () => {
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
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("discover_movies")} | MoviesApp`;
  }, [t]);

  /**
   * We are setting the state for page as '1' as we want to show the first page first
   * https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3
   */
  const [page, setPage] = useState(1);
  // The below code has bee slighly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>(
    ["discover", page, lang],
    () => getMovies(page, lang),
    /**
     * We added this line in our useQuery hook in order to tell React-Query that this query is part
     * of a paginated component. React-Query would then take care to not remove the cached data for
     *  each page for a super fast response time in case of a page change.
     * https://upmostly.com/tutorials/how-to-build-a-pagination-component-with-react-query
     */
    { keepPreviousData: true }
  );

  // Create the state for 'sortOrder' and set to newest first
  const [sortOrder, setSortOrder] = useState("desc");

  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

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

  // This is the ternary operator, which works like an inline if...else.
  const movies = data ? data.results : [];
  const displayedMovies = filterFunction(movies);

  /**
   * We use the spread operator now to create a shallow copy of 'displayedTVSeries'
   * before sorting because `.sort()` changes the original array in place, whereas the spread
   * operator ensure we only create that shallow copy and won't modify the original array.
   * Without spread operator, the sort() function was actually creating duplicates for certain
   * movies. This ensures we don't modify the original filtered list,
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
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

  // Redundant, but necessary to avoid app crashing.
  // const favourites = movies.filter((m) => m.favourite);
  // localStorage.setItem("favourites", JSON.stringify(favourites));
  // const addToFavourites = (movieId: number) => true;

  return (
    <>
      <PageTemplate
        // title="Discover Movies"
        title={t("discover_movies")}
        movies={sortedDisplayedMovies}
        // movies={paginatedMovies}
        action={(movie: BaseMovieProps) => {
          return <AddToFavouritesIcon {...movie} />;
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
      <Pagination
        // color="primary"
        size="large"
        count={data?.total_pages || 1}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          py: 1,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #ccc",
        }}
      />
    </>
  );
};
export default DiscoverMoviesPage;
