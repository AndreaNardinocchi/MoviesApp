import React from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../components/templateMovieListPage";
import { getActorMovies } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { BaseMovieProps } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

const ActorMoviesPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  // Extract the 'id' parameter from the URL using React Router's useParams hook
  const { id } = useParams<{ id: string }>();
  // Fetch movie data using React Query's useQuery hook
  const {
    data: movies,
    error,
    isLoading,
    isError,
  } = useQuery<BaseMovieProps[], Error>(
    ["actorMovies", id],
    // Fetch the movie with cast information using the provided function
    () => getActorMovies(id || "")
  );

  if (isLoading) return <Spinner />;

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  if (!movies) return <h2>{t("actor_no_movies")}</h2>;

  return (
    <PageTemplate
      title={t("actor_movies_header")}
      movies={movies}
      action={(movie: BaseMovieProps) => {
        return <AddToFavouritesIcon {...movie} />;
      }}
    />
  );
};

export default ActorMoviesPage;
