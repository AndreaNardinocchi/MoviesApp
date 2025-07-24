import React, { useEffect, useState } from "react";
import { getCurrentlyAiringTV } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import { useQuery } from "react-query";
import { FilterOption, TVSeriesResponse } from "../types/interfaces";
import TVSeriesListPageTemplate from "../components/templateTVSeriesList";
import { useTranslation } from "react-i18next";
import useFiltering from "../hooks/useFiltering";
import { Pagination } from "@mui/material";
import TVSeriesFilterUI, {
  genreFilter,
  releaseFilter,
  titleFilter,
} from "../components/TVSeriesFilterUI";

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

const TVSeriesPage: React.FC = () => {
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

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("TV_series")} | MovieApp`;
  }, [t]);

  const [page, setPage] = useState(1);
  // The below code has been slightly adjusted as per
  // https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries?from=reactQueryV3

  // Create the state for 'sortOrder' and set to newest first
  const [sortOrder, setSortOrder] = useState("desc");

  // Set up filtering state and logic using the custom `useFiltering` hook
  const { filterValues, setFilterValues, filterFunction } = useFiltering([
    titleFiltering,
    genreFiltering,
    releaseFiltering,
  ]);

  /**
   * 'series' is an array of BaseTVSeriesProps.
   * To access the 'total_pages', series must be an object containing metadata like page, total_pages, and results and not an array.
   */
  const {
    data: series,
    isLoading,
    isError,
    error,
  } = useQuery<TVSeriesResponse>(
    ["currentlyAiringTV", page, lang],
    () => getCurrentlyAiringTV(page, lang), // fetch function
    { keepPreviousData: true }
  );

  if (isLoading) return <Spinner />;

  if (isError)
    return <p>Error fetching TV series: {(error as Error).message}</p>;

  /**
   * We use `series.results` here because the API response `series`
   * is an object containing metadata like `page` and `total_pages`,
   * and the actual array of series object is inside the `results` property.
   * The API function has been updated to return response.json(); otherwise
   * the pagination would not work
   */
  const displayedTVSeries = series?.results
    ? filterFunction(series.results)
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
  const sortedDisplayedTVSeries = [...displayedTVSeries].sort((a, b) => {
    if (!a.first_air_date || !b.first_air_date) return 0;
    /**
     * We sort the already 'filtered TV series' by their first_air_date,
     * depending on the sortOrder selected by the user.
     * If sortOrder is 'asc', compare a to b (oldest first)
     * If sortOrder is 'desc', compare b to a (newest first)
     * */
    return sortOrder === "asc"
      ? a.first_air_date.localeCompare(b.first_air_date)
      : b.first_air_date.localeCompare(a.first_air_date);
  });

  // Called when the user changes title, genre filter, release year, and sort
  const changeFilterValues = (type: FilterOption, value: string) => {
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
     * After filtering, we sort the already 'filtered movies' by their release_date,
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
      {/* This is a template created 'ad hoc' for the TV series page, as we are using the 'series' 
      and not the 'movies' list*/}
      <TVSeriesListPageTemplate
        title={t("tv_series")}
        /**
         * 'series' supplies the array of TV series to be displayed
         * If `series` is null or undefined, fallback to an empty array to prevent runtime errors
         */
        series={sortedDisplayedTVSeries}
        /**
         * The `action` prop is a function that defines an extra UI action (an 'icon button', for instance)
         * to be shown on each series card. In this case, it returns nothing,
         * meaning no action will be shown or triggered on any series card.
         */
        action={() => <></>}
      />
      {/* Render the title/genre filtering UI BELOW the movie list */}
      <TVSeriesFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
        releaseFilter={Number(filterValues[2].value)}
        sortOrder={sortOrder}
      />
      <Pagination
        size="large"
        count={series?.total_pages || 1}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white", // or match your theme
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

export default TVSeriesPage;
