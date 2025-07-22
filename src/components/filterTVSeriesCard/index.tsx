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
  const { i18n, t } = useTranslation();
  const lang = i18n.language || "en-US";

  const { data, error, isLoading, isError } = useQuery<GenreData, Error>(
    ["tvGenres", lang],
    () => getTVSeriesGenres(lang)
  );

  const currentYear = new Date().getFullYear();
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
            <InputLabel id="tv-release-year-label">
              {t("release_year")}
            </InputLabel>
            <Select
              labelId="tv-release-year-label"
              id="tv-release-year-select"
              value={releaseFilter ? releaseFilter.toString() : "0"}
              onChange={handleReleaseYearChange}
            >
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
          <FormControl sx={styles.formControl}>
            <InputLabel id="tv-sort-label">{t("sort_by_date")}</InputLabel>
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
