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
  value: 0, // 0 = show all years and MUST be a number, otherwise it won't show any movies
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
    document.title = `${t("discover_movies")} | MovieApp`;
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
    { keepPreviousData: true }
  );

  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first

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

  //   const changeFilterValues = (type: string, value: string) => {
  //   if (type === "sort") {
  //     setSortOrder(value); // ✅ Handle sort separately
  //     return;
  //   }
  //   // Called when the user changes title, genre filter, or release year
  //  // const changeFilterValues = (type: string, value: string) => {
  //     const changedFilter = { name: type, value };
  //     const updatedFilterSet =
  //       /**
  //        * If type === "title", update the first filter.
  //        * Otherwise, if type === "genre", update the second filter.
  //        * Otherwise, type === "release", update the third filter.
  //        */
  //       type === "title"

  //     return;
  //         ? [changedFilter, filterValues[1], filterValues[2]]
  //         : type === "genre"
  //         ? [filterValues[0], changedFilter, filterValues[2]]
  //         : [filterValues[0], filterValues[1], changedFilter]; // handles "release"
  //     setFilterValues(updatedFilterSet);
  //   };

  const changeFilterValues = (type: string, value: string) => {
    if (type === "sort") {
      setSortOrder(value); // ✅ Handle sort separately
      return;
    }

    const changedFilter = { name: type, value };

    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1], filterValues[2]]
        : type === "genre"
        ? [filterValues[0], changedFilter, filterValues[2]]
        : [filterValues[0], filterValues[1], changedFilter]; // handles "release"

    setFilterValues(updatedFilterSet);
  };

  // This is the ternary operator, which works like an inline if...else.
  const movies = data ? data.results : [];
  const displayedMovies = filterFunction(movies);

  // Add sorting by release date
  displayedMovies.sort((a, b) => {
    if (!a.release_date || !b.release_date) return 0;
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
        movies={displayedMovies}
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
