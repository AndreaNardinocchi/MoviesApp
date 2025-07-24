import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseTVSeriesProps, FilterOption } from "../../types/interfaces";
import { useTranslation } from "react-i18next";
import FilterTVSeriesCard from "../filterTVSeriesCard";

// eslint-disable-next-line react-refresh/only-export-components
export const titleFilter = (
  series: BaseTVSeriesProps,
  value: string
): boolean => {
  /**
   * This filters TV series by their title (or name field).
   * It checks if the search string is included in the series name.
   * To avoid errors, we default to an empty string if `name` is missing.
   */
  return (series.name || "").toLowerCase().search(value.toLowerCase()) !== -1;
};

// eslint-disable-next-line react-refresh/only-export-components
export const genreFilter = (
  series: BaseTVSeriesProps,
  value: string
): boolean => {
  const genreId = Number(value);
  const genreIds = series.genre_ids;
  return genreId > 0 && genreIds ? genreIds.includes(genreId) : true;
};

/**
 * This function filters movies by their release year.
 * It returns true if the movie's release year matches the given year (value).
 * If value is 0, it means "All years" and the function returns true for every movie.
 * value: number is a parameter passed into the releaseFilter function, and
 * it represents the year selected by the user to filter movies by release date
 * However, this function was throwing an error when deploying in Vercel:
 * Types of property 'value' are incompatible.
 * Type 'number' is not assignable to type 'string'. src/pages/discoverPage.tsx(89,5): error TS2322:
 * Type '{ name: string; value: number; condition: (movie: BaseMovieProps, value: number) => boolean; }'
 * is not assignable to type 'Filter'.
 * Hence, I changed the value to 'string', but then converted to number for comparison.
 * useFiltering.ts
 * interface Filter {
 * name: string;
 * value: string;
 * condition: (item: any, value: string) => boolean;
 * }
 * */
// eslint-disable-next-line react-refresh/only-export-components
export const releaseFilter = (
  series: BaseTVSeriesProps,
  value: string
  // The : boolean after the parameters means this function will always return a boolean value (true or false)
  // https://www.typescriptlang.org/docs/handbook/2/functions.html#function-types
): boolean => {
  // Convert the value to a number for comparison
  const year = Number(value);
  // If value is 0, do not filter out any movies, but show them all
  if (year === 0) return true;
  // If the movie has no release date, exclude it and return it as false
  else if (!series.first_air_date) return false;
  /**
   * Extract the year from the movie's release_date string
   * getFullYear() is a built-in JavaScript Date object method.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
   */
  const TVseriesYear = new Date(series.first_air_date).getFullYear();
  // Return true only if the movie's release year equals the filtered year
  return TVseriesYear === year;
};

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
  },
  fab: {
    marginTop: "3%",
    position: "fixed",
    top: {
      xs: "8%",
      sm: "6%",
      md: "5%",
      lg: "4%",
    },
    right: "2%",
    bgcolor: "#8E4585",
    color: "white",
  },
};

interface TVSeriesFilterUIProps {
  onFilterValuesChange: (f: FilterOption, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  releaseFilter: number;
  sortOrder: string;
}

const TVSeriesFilterUI: React.FC<TVSeriesFilterUIProps> = ({
  onFilterValuesChange,
  titleFilter,
  genreFilter,
  releaseFilter,
  sortOrder,
}) => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();

  /**
   * We are using the translation hook to get the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Fab
        color="default"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          ...styles.fab,
          "&:hover": {
            color: "#000000",
            bgcolor: "#ffe6f0",
          },
        }}
      >
        {t("filter")}
      </Fab>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterTVSeriesCard
          onUserInput={onFilterValuesChange}
          titleFilter={titleFilter}
          genreFilter={genreFilter}
          releaseFilter={releaseFilter}
          sortOrder={sortOrder}
        />
      </Drawer>
    </>
  );
};

export default TVSeriesFilterUI;
