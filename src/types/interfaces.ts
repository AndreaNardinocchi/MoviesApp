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
  /**
   * List of movie release years.
   * https://developers.themoviedb.org/3/movies/get-movie-details
   */
  release: {
    year: number;
  }[];
}

export type FilterOption = "title" | "genre" | "release";

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
 * List of movie release years.
 * https://developers.themoviedb.org/3/movies/get-movie-details
 */
export interface ReleaseYear {
  release: {
    year: number;
  }[];
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

/**
 * Represents the basic structure of a TV series item returned by the TMDb API.
 * This interface defines only the core fields needed to display a TV series in a grid.
 * Source: https://developer.themoviedb.org/reference/tv-series-details
 */
export interface BaseTVSeriesProps {
  title: string;
  id: number;
  name: string;
  // Short summary or description of the TV series storyline
  overview: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TVSeriesListProps {
  series: BaseTVSeriesProps[];
  action: (series: BaseTVSeriesProps) => React.ReactNode;
}

/**
 * Props will allow us to reuse the template in different scenarios.
 * */
export interface TVSeriesListPageTemplateProps extends TVSeriesListProps {
  title: string;
}

/**
 * Represents detailed properties of a TV series.
 * Source: https://developer.themoviedb.org/reference/tv-series-details
 */
export interface TVSeriesDetailsProps extends BaseTVSeriesProps {
  genres: {
    id: number;
    name: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];

  // The below data shows on the TV Series page and extends the BaseTVSeriesProps
  // which is being used on the TVSeriesCard and TVSeriesList too
  // https://developer.themoviedb.org/reference/tv-series-details
  // The official homepage URL of the series, and it can be null or an external link
  homepage: string;
  // A brief phrase or slogan associated with the series
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
  cast?: CastMember[];
  favourite?: boolean;
}

// Signed up User interface
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

// AuthContext Interface
export interface AuthContextInterface {
  token: string | null;
  // User object added
  user?: User;
  authenticate: (username: string, password: string) => void;
  signout: () => void;
}

/**
 * Represents the response structure from
 * https://developer.themoviedb.org/reference/movie-upcoming-list API endpoint.
 * 'page' is the current page number
 * 'total_pages' is the total number of pages available.
 * 'results' is an array of movie objects 'BaseMovieProps' of the current page.
 */
export interface UpcomingMoviesResponse {
  page: number;
  total_pages: number;
  results: BaseMovieProps[];
}

/**
 * Represents the response structure from
 * https://developer.themoviedb.org/reference/movie-now-playing-list API endpoint.
 * 'page' is the current page number
 * 'total_pages' is the total number of pages available.
 * 'results' is an array of movie objects 'BaseMovieProps' of the current page.
 */
export interface NowPlayingMoviesResponse {
  page: number;
  total_pages: number;
  results: BaseMovieProps[];
}
