export const getMovies = (page: number, language = "en-US") => {
  return fetch(
    /**  To retrieve page by page for pagination, we added the 'page' parameter, so that,
     * whenever a page is selecetd, the API will show movies belonging to that
     * specific page
     */
    // https://www.themoviedb.org/talk/5e23977c8f26bc0011777a02?
    `https://api.themoviedb.org/3/discover/movie?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=${language}&page=${page}`
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Unable to fetch movies. Response status: ${response.status}`
        );
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

// export const getMovie = (id: string) => {
//   return fetch(
//     `https://api.themoviedb.org/3/movie/${id}?api_key=${
//       import.meta.env.VITE_TMDB_KEY
//     }`
//   )
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(
//           `Failed to get movie data. Response status: ${response.status}`
//         );
//       }
//       return response.json();
//     })
//     .catch((error) => {
//       throw error;
//     });
// };

/**
 * Fetches detailed information about a specific movie from TMDb.
 * The 'Language' string is used for localized results and its default is "en-US".
 * https://developer.themoviedb.org/reference/movie-details
 * https://www.themoviedb.org/talk/593fed45c3a36851f8002d83
 */
export const getMovie = (id: string | number, language = "en-US") => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=${language}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to get movie data. Response status: ${response.status}`
        );
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getGenres = () => {
  return fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
      import.meta.env.VITE_TMDB_KEY +
      "&language=en-US"
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Unable to fetch genres. Response status: ${response.status}`
        );
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

export const getMovieImages = (id: string | number, language = "en-US") => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=${language}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to fetch images");
      }
      return response.json();
    })
    .then((json) => json.posters)
    .catch((error) => {
      throw error;
    });
};

export const getMovieReviews = (id: string | number) => {
  //movie id can be string or number
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((res) => res.json())
    .then((json) => {
      // console.log(json.results);
      return json.results;
    });
};

/**
 * This function returns now the full JSON response from TMDB,
 * which includes additional metadata like `total_pages`, `page`, and `results`, as
 * in the 'UpcomingMoviesResponse' interface .
 * We return the full response instead of just `json.results`
 * so that pagination can work correctly (using `total_pages`).
 * If we only return `json.results`, we lose access to pagination info,
 * such as `total_pages`, `page`, and `results`.
 * https://developer.themoviedb.org/reference/movie-upcoming-list
 */
export const getUpcomingMovies = (page: number, language = "en-US") => {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=${language}&page=${page}`
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Unable to fetch movies. Response status: ${response.status}`
        );
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Fetches the cast (actors) for a given movie ID from The Movie Database (TMDb) API.
 * https://developer.themoviedb.org/reference/movie-credits
 * 'id' is the ID of the movie (can be a string or number)
 */
export const getMovieCredits = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch movie credits");
      return res.json();
    })
    .then((json) => json.cast) // Only return the cast (actors)
    .catch((error) => {
      throw error;
    });
};

/**
 * Fetches detailed information for an actor/person by ID from TMDb.
 * https://developer.themoviedb.org/reference/person-details
 * 'id' is the actor's person ID as a string.
 */
export const fetchActorDetails = async (id: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  );
  if (!res.ok) throw new Error("Failed to fetch actor details");
  return res.json();
};

/**
 * Fetches profile images for a person (actor) from TMDb.
 *  https://developer.themoviedb.org/reference/person-images
 * 'personId' is TMDb ID of the person.
 */
export const getPersonImages = async (personId: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${personId}/images?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  );
  if (!response.ok) throw new Error("failed to fetch person images");
  return response.json();
};

/**
 * Fetches movies released in a specific year, sorted by release date.
 * https://developer.themoviedb.org/reference/discover-movie
 * 'year' is the year to filter movies by.
 */
export const getMoviesPerReleaseYear = async (year: number) => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&sort_by=release_date.asc&primary_release_year=${year}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to get movie data. Response status: ${response.status}`
        );
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Fetches the list of movies that are now playing in theaters.
 * https://developer.themoviedb.org/reference/movie-now-playing-list
 */
export const getNowPlayingMovies = (page: number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=${page}`
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Unable to fetch movies. Response status: ${response.status}`
        );
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
//     .then((res) => res.json())
//     .then((json) => json.results); // Only return the movie list
// };

/**
 * Fetches a list of currently airing TV series from TMDb.
 * https://developer.themoviedb.org/reference/tv-on-the-air-list
 */
export const getCurrentlyAiringTV = () => {
  return fetch(
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=1`
  )
    .then((res) => res.json())
    .then((json) => json.results); // Only return the TV show list
};

/**
 * Fetches poster images for a TV series from TMDb.
 * https://developer.themoviedb.org/reference/tv-series-images
 * Image usage: Combine `file_path` with https://image.tmdb.org/t/p/{size}/{file_path}
 * 'id' is the TMDb ID of the TV series (can be a string or number)
 */
export const getTVSeriesImages = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/images?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to fetch images");
      }
      return response.json();
    })
    .then((json) => json.posters)
    .catch((error) => {
      throw error;
    });
};

/**
 * This is cloned from getMovie function, modified to fetch TV series details instead of movies.
 * https://developers.themoviedb.org/3/tv/get-tv-details
 */
export const getTVSeries = (id: string) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to get TV series data. Response status: ${response.status}`
        );
      }
      console.log("TV Series Details:", response);
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Fetches the cast (actors) for a given TV series ID from The Movie Database (TMDb) API.
 * https://developers.themoviedb.org/3/tv/get-tv-credits
 * 'id' is the ID of the TV series (can be a string or number)
 */
export const getTVSeriesCredits = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch TV series credits");
      console.log("TV Series Details:", res);
      return res.json();
    })
    .then((json) => json.cast) // Only return the cast (actors)
    .catch((error) => {
      throw error;
    });
};

/**
 * Fetches the movies an actor played.
 * https://tmdbapis.metamanager.wiki/en/latest/_modules/tmdbapis/api3.html
 * 'id' is the ID of the actor (can be a string or number)
 */
export const getActorMovies = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json.cast);
      return json.cast;
    });
};
