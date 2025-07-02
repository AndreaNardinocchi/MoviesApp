export const getMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&include_adult=false&include_video=false&page=1`
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

export const getMovie = (id: string) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
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

export const getMovieImages = (id: string | number) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${
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

export const getUpcomingMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=1`
  )
    .then((res) => res.json())
    .then((json) => json.results);
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
