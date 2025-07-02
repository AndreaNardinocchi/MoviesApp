export interface BaseMovieProps {
  title: string;
  budget: number;
  homepage: string | undefined;
  id: number;
  imdb_id: string;
  original_language: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  poster_path?: string;
  tagline: string;
  runtime: number;
  revenue: number;
  vote_count: number;
  favourite?: boolean;
  genre_ids?: number[];
}

/**
 * This is a data extract representing a single cast member in a movie or TV show's credits.
 * Reference: https://developer.themoviedb.org/reference/movie-credits
 */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// export interface BaseMovieListProps {
//   movies: BaseMovieProps[];
//   selectFavourite: (movieId: number) => void; //add this
//   // '?' will make selectFavourite optional
// }

export interface BaseMovieListProps {
  movies: BaseMovieProps[];
  action: (m: BaseMovieProps) => React.ReactNode;
}

export interface MovieDetailsProps extends BaseMovieProps {
  genres: {
    id: number;
    name: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  /**
   * List of cast members associated with the movie.
   * We want to make the cast data available wherever we use the MovieDetailsProps —
   * especially in components like TemplateMoviePage or detail views
   * */
  cast: CastMember[];
}

export type FilterOption = "title" | "genre";

/**
 * To avoid code duplication between the home page and favourites page,
 * we can define a template page for displaying a list of movies.
 * Props will allow us to reuse the template in different scenarios.
 * */
export interface MovieListPageTemplateProps extends BaseMovieListProps {
  title: string;
}

export interface Review {
  id: string;
  content: string;
  author: string;
}

/**
 * Interfaces for the movies and genres data that
 * describe the “shape” of the data returned from the API
 * */
export interface GenreData {
  genres: {
    id: string;
    name: string;
  }[];
}

export interface DiscoverMovies {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseMovieProps[];
}

export interface Review {
  author: string;
  content: string;
  agree: boolean;
  rating: number;
  movieId: number;
}

export interface MovieImage {
  file_path: string;
  aspect_ratio?: number; //some props are optional...
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}
