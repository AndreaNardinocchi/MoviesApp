import React from "react";
import { getCurrentlyAiringTV } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import { useQuery } from "react-query";
import { BaseTVSeriesProps } from "../types/interfaces";
import TVSeriesListPageTemplate from "../components/templateTVSeriesList";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

const TVSeriesPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const {
    data: series,
    isLoading,
    isError,
    error,
  } = useQuery<BaseTVSeriesProps[]>(
    ["currentlyAiringTV"],
    getCurrentlyAiringTV
  );

  if (isLoading) return <Spinner />;

  if (isError)
    return <p>Error fetching TV series: {(error as Error).message}</p>;

  return (
    <>
      {/* This is a template created 'ad hoc' for the TV series page, as we are using the 'series' 
    and not the 'movies' list*/}
      <TVSeriesListPageTemplate
        // title="Currently Airing TV Series"
        title={t("tv_series")}
        /**
         * 'series' supplies the array of TV series to be displayed
         * If `series` is null or undefined, fallback to an empty array to prevent runtime errors
         */
        series={series || []}
        /**
         * The `action` prop is a function that defines an extra UI action (an 'icon button', for instance)
         * to be shown on each series card. In this case, it returns nothing,
         * meaning no action will be shown or triggered on any series card.
         */
        action={() => <></>}
      />
    </>
  );
};

export default TVSeriesPage;
