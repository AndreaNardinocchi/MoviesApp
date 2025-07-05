import React from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../components/templateMovieListPage";
import { getActorMovies } from "../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { BaseMovieProps } from "../types/interfaces";

const ActorMoviesPage: React.FC = () => {
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

  if (!movies) return <h2>This actor has no known movie credits.</h2>;

  return (
    <PageTemplate
      title="Movies Starring This Actor"
      movies={movies}
      action={(movie: BaseMovieProps) => {
        return <AddToFavouritesIcon {...movie} />;
      }}
    />
  );
};

export default ActorMoviesPage;
