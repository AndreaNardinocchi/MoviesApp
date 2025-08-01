import React, { ChangeEvent } from "react";
import { FilterOption, GenreData } from "../../types/interfaces";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import { getTVSeriesGenres } from "../../api/tmdb-api"; // Use your TV genres fetch function
import { useQuery } from "react-query";
import Spinner from "../spinner";
import { useTranslation } from "react-i18next";

interface FilterTVSeriesCardProps {
  onUserInput: (f: FilterOption, s: string) => void;
  titleFilter: string;
  genreFilter: string;
  releaseFilter: number;
  sortOrder: string;
}

const styles = {
  root: {
    maxWidth: 345,
  },
  formControl: {
    margin: 1,
    minWidth: 220,
    backgroundColor: "rgb(255, 255, 255)",
  },
};

const FilterTVSeriesCard: React.FC<FilterTVSeriesCardProps> = ({
  titleFilter,
  genreFilter,
  releaseFilter,
  sortOrder,
  onUserInput,
}) => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { i18n, t } = useTranslation();
  const lang = i18n.language || "en-US";
  console.log("Current language:", i18n.language);

  const { data, error, isLoading, isError } = useQuery<GenreData, Error>(
    ["tvGenres", lang],
    () => getTVSeriesGenres(lang)
  );

  /**
   * Get the current year using the Date object
   * `new Date()` creates a Date instance representing the current date and time.
   * getFullYear()` extracts the full year as a 4-digit number .
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear
   */
  const currentYear = new Date().getFullYear();

  /**
   * Create an array of years from currentYear down to 1950 (random year).
   * The Array.from() static method creates a new, shallow-copied Array instance
   * from an iterable or array-like object.
   * The array will contain (currentYear - 1949) elements to include 1950.
   * Example: if currentYear = 2025, then length = 2025 - 1949 = 76.
   * The map function takes two arguments:
   * `_` is the current value
   * `i` is the current index in the array.
   * For each index `i`, we subtract `i` from `currentYear` to get descending years.
   * Example: i = 0 → 2025, i = 1 → 2024, ..., i = 75 → 1950
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#using_arrow_functions_and_array.from
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
   */
  const years: number[] = Array.from(
    { length: currentYear - 1949 },
    (_, i) => currentYear - i
  );

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <h1>{error?.message}</h1>;
  }

  const genres = data?.genres || [];
  if (genres.length && genres[0].name !== t("all")) {
    genres.unshift({ id: "0", name: t("all") });
  }

  const handleChange = (
    e: SelectChangeEvent | ChangeEvent<HTMLInputElement>,
    type: FilterOption,
    value: string
  ) => {
    e.preventDefault();
    onUserInput(type, value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e, "title", e.target.value);
  };

  const handleGenreChange = (e: SelectChangeEvent) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleReleaseYearChange = (e: SelectChangeEvent) => {
    handleChange(e, "release", e.target.value);
  };

  const handleSortOrderChange = (e: SelectChangeEvent) => {
    handleChange(e, "sort", e.target.value);
  };

  return (
    <>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <FilterAltIcon fontSize="large" />
            {t("filter_tv_series")}
          </Typography>
          <TextField
            sx={styles.formControl}
            id="tv-title-search"
            label={t("search_field")}
            type="search"
            value={titleFilter}
            variant="filled"
            onChange={handleTextChange}
          />

          <FormControl sx={styles.formControl}>
            <InputLabel id="tv-genre-label">{t("genre")}</InputLabel>
            <Select
              labelId="tv-genre-label"
              id="tv-genre-select"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <InputLabel id="tv-first-aired-date-label">
              {t("first_aired_date")}
            </InputLabel>
            <Select
              labelId="tv-first-aired-date-label"
              id="tv-first-aired-date-select"
              // Ensure releaseFilter is defined before calling .toString(). Here's how you can safely handle it:
              value={releaseFilter ? releaseFilter.toString() : "0"}
              onChange={handleReleaseYearChange}
            >
              {/* value={0} was needed to ensure that the number "0" was correctly read and 
              all movies would show when "All' is selected" */}
              <MenuItem value={0}>{t("all")}</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <SortIcon fontSize="large" />
            {t("sort_tv_series")}
          </Typography>
          {/* 
      This dropdown allows the user to sort movies by release date.
      'asc' is ascending which puts the oldest movies first
      'desc' is descending which puts the newest movies first
      The selected value is controlled by the `sortOrder` prop.
      When changed, it triggers the `handleSortOrder` function to update the parent state.
    */}
          <FormControl sx={styles.formControl}>
            <InputLabel id="tv-sort-label">
              {t("sort_by_first_air_date")}
            </InputLabel>
            <Select
              labelId="tv-sort-label"
              id="tv-sort-select"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <MenuItem value="asc">{t("oldest_first")}</MenuItem>
              <MenuItem value="desc">{t("newest_first")}</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </>
  );
};

export default FilterTVSeriesCard;
