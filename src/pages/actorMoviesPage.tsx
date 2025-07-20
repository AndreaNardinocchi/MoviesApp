import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageTemplate from "../components/templateMovieListPage";
import { fetchActorDetails, getActorMovies } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { BaseMovieProps } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
// import i18n from "../i18n/i18n";

const ActorMoviesPage: React.FC = () => {
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

  // Extract the 'id' parameter from the URL using React Router's useParams hook
  const { movieId, actorId } = useParams() as {
    movieId: string;
    actorId: string;
  };
  // const { id } = useParams<{ id: string }>();
  // Fetch movie data using React Query's useQuery hook
  const {
    data: movies,
    error,
    isLoading,
    isError,
  } = useQuery<BaseMovieProps[], Error>(
    ["actorMovies", actorId, lang],
    // Fetch the movie with cast information using the provided function
    () => getActorMovies(actorId || "", lang)
  );

  // Fetch movie data using React Query's useQuery hook
  const { data: actorDetails } = useQuery(
    ["actorDetails", actorId, lang],
    // Fetch the movie with cast information using the provided function
    () => fetchActorDetails(actorId || "", lang)
  );

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("actor_movies_header")}  ${
      actorDetails?.name
    }  | MovieApp`;
  }, [t, actorDetails?.name]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return <h1>{(error as Error).message}</h1>;
  }

  if (!movies) return <h2>{t("actor_no_movies")}</h2>;

  return (
    <>
      <PageTemplate
        title={`${t("actor_movies_header")} ${actorDetails?.name}`}
        movies={movies}
        action={(movie: BaseMovieProps) => {
          return <AddToFavouritesIcon {...movie} />;
        }}
      />

      {/* Sticky Bar */}
      {/* https://mui.com/system/react-box/ */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.06)",
          display: "flex", // Use flexbox
          justifyContent: "flex-start", // Push content to the left
          alignItems: "center", // Vertically center the content
          padding: {
            xs: "3% 4%", // small devices
            sm: "2% 1.8%", // tablets
            md: "1.5% 1.0%", // medium screens
            lg: "0.7% 0.8%", // large screens
          },
        }}
      >
        <Link
          to={`/movies/${movieId}/actor/${actorId}`}
          style={{
            textDecoration: "none",
            color: "#8E4585",
            fontWeight: "bold",
            textAlign: "right",
          }}
        >
          ← {t("back_to_actor_page")} {actorDetails?.name}
        </Link>
      </Box>
    </>
  );
};

export default ActorMoviesPage;
