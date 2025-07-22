import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import { BaseTVSeriesProps } from "../../types/interfaces";
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
 * This function filters TV series by their first air year.
 * It returns true if the series's first air year matches the given year (value).
 * If value is 0, it means "All years" and the function returns true for every series.
 * value: number is a parameter passed into the releaseFilter function,
 * and it represents the year selected by the user to filter series by air date
 */
// eslint-disable-next-line react-refresh/only-export-components
export const releaseFilter = (
  series: BaseTVSeriesProps,
  value: number
): boolean => {
  if (value === 0) return true;
  if (!series.first_air_date) return false;
  const seriesYear = new Date(series.first_air_date).getFullYear();
  return seriesYear === Number(value);
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
  onFilterValuesChange: (f: string, s: string) => void;
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
