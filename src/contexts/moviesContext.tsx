import React, { useState, useCallback, useEffect } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";
import { supabase } from "../supabaseClient";

// Define the structure of the context's value using an interface
// This describes what data and functions are available in the context
interface MovieContextInterface {
  favourites: number[]; // List of favourite movie IDs
  // mustWatchList: number[]; // This line was used when storing only IDs, now replaced below
  mustWatchList: BaseMovieProps[]; // List of full movie objects for must-watch list page
  addToFavourites: (movie: BaseMovieProps) => void; // Function to add a movie to favourites
  addToMustWatchList: (movie: BaseMovieProps) => void; // Function to add a movie to must-watch list
  removeFromFavourites: (movie: BaseMovieProps) => void; // Function to remove a movie from favourites
  removeFromMustWatchList: (movie: BaseMovieProps) => void; // Function to remove a must watch movie
  addReview: (movie: BaseMovieProps, review: Review) => void; // Function to add a review to a movie
}

// Define an initial state for the context with empty/default implementations
// This prevents undefined access before the provider is mounted
const initialContextState: MovieContextInterface = {
  favourites: [],
  mustWatchList: [],
  addToFavourites: () => {},
  addToMustWatchList: () => {},
  removeFromFavourites: () => {},
  removeFromMustWatchList: () => {},
  addReview: (movie, review) => {
    movie.id;
    review;
  },
};

// Create the context using React.createContext with the initial state
// eslint-disable-next-line react-refresh/only-export-components
export const MoviesContext =
  React.createContext<MovieContextInterface>(initialContextState);

// Define the provider component that wraps parts of the app that need this context
const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // State to store the list of favourite movie IDs
  const [favourites, setFavourites] = useState<number[]>([]);
  // State to store the user's reviews for movies
  const [myReviews, setMyReviews] = useState<Review[]>([]); // NOTE: Incorrect type if reviews are meant to be mapped by movie ID

  // const [mustWatchList, setMustWatchList] = useState<number[]>([]);
  // This line was used when storing only movie IDs — commented out in favor of full objects

  // This ensures that we are storing full movie objects in mustWatchList, not just IDs.
  const [mustWatchList, setMustWatchList] = useState<BaseMovieProps[]>([]);

  // Function to add a movie to the favourites list, ensuring no duplicates.
  // We extended the functon to 'insert' data to the 'supabase' database
  const addToFavourites = useCallback(async (movie: BaseMovieProps) => {
    setFavourites((prevFavourites) => {
      if (!prevFavourites.includes(movie.id)) {
        console.log("Adding to favourites:", movie.id);
        return [...prevFavourites, movie.id];
      }
      return prevFavourites;
    });

    /**
     * We retrieve the user data from the supabase database
     * https://supabase.com/docs/reference/javascript/auth-getuser
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user or error, we will get the below error
    if (!user || userError) {
      console.error("User not authenticated", userError);
      return;
    }

    /**
     * This function will enable us to avoid duplicates. Essentially, we are
     * 'selecting' the id of the movie addition, and checking 'user_id' and 'movie_id'
     * to find the existing one and append maybeSingle() to Return data as a single object
     * instead of an array of objects, meaning it won't get duplicated.
     * https://supabase.com/docs/reference/javascript/maybesingle
     *  */
    const { data: exist, error: selectError } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing favourite: ", selectError.message);
      return;
    }

    if (exist) {
      console.error(
        "This movie already exists in your favourite movies list: ",
        movie.title
      );
      return;
    }
    /**
     * We then insert the favourite movie  to supabase based upon the table structure
     * we created in the supabase SQL Editor
     * https://supabase.com/docs/guides/auth/managing-user-data
     * https://supabase.com/docs/guides/database/postgres/row-level-security
     * https://supabase.com/docs/reference/javascript/insert
     */
    const { error } = await supabase.from("favourites").insert({
      user_id: user.id,
      movie_id: movie.id.toString(),
      movie_title: movie.title,
      poster_path: movie.poster_path,
    });

    if (error) {
      console.error("No data inserted in Supabase: ", error.message);
    }

    console.log(
      "Successfully added this movie to Supabase favourites: ",
      movie.title
    );
  }, []);

  /**
   * Fetches the list of favourite movies for a given user from Supabase.
   * useCallBack() lets us cache a function definition between re-renders.
   *https://react.dev/reference/react/useCallback
   */
  const fetchSupabaseFavouriteMovies = useCallback(async (userId: string) => {
    /**
     * Use Supabase to query the "favourites" table
     * where the "user_id" column matches the provided userId
     * https://supabase.com/docs/reference/javascript/using-filters
     */
    const { data, error } = await supabase
      .from("favourites")
      .select()
      .eq("user_id", userId);

    // If error, we will get the below message
    if (error) {
      console.error("User not found", error.message);
      return;
    }

    // If data is successfully returned, map through the movie to extract the movie_id value,
    // and update the component's state const [favourites, setFavourites] = useState<number[]>([]);
    if (data) {
      // We amended this since we had declared the useState for the const favourites as an array of numbers
      // Also, 'm' is a better label than 'movie', which is an object, but we are essentially fetchin a value from
      // the supabase table row
      // const ids = data.map((movie) => movie.movie_id);
      const ids = data.map((m) => Number(m.movie_id));
      setFavourites(ids);
    }
  }, []);

  /**
   * useEffect here enables to load the user's favourite movies when the component mounts.
   * Any time the `fetchSupabaseFavouriteMovies` function changes the favourites are fetched
   */
  useEffect(() => {
    const loadUserFavourites = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found", userError?.message);
        return;
      }

      fetchSupabaseFavouriteMovies(user?.id);
    };

    loadUserFavourites();

    /**
     * This sets up a listener to detect changes in the authentication user state
     * SIGNED_IN: Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
     * SIGNED_OUT: Emitted when the user signs out.
     * https://supabase.com/docs/reference/javascript/auth-onauthstatechange
     * */
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (event === "SIGNED_IN" && session) {
        fetchSupabaseFavouriteMovies(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setFavourites([]); // This will set the favourites list to empty
      }
    });

    // Call unsubscribe to remove the callback NOT WORKING
    // data.subscription.unsubscribe();

    /**
     * The above unsubscribe call was not correctly unsubscribing, and we were
     * ending up showing the same favourites list regardless of the user logging in.
     * Apparently, the correct logic is  return () => { // Cleanup logic };
     * https://devchallenges.io/learn/4-frontend-libraries/side-effects-in-react
     */

    return () => {
      data.subscription.unsubscribe();
    };
  }, [fetchSupabaseFavouriteMovies]); // dependency array

  // Function to add a review for a movie
  const addReview = (movie: BaseMovieProps, review: Review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  // Function to remove a movie from the favourites list
  const removeFromFavourites = useCallback(async (movie: BaseMovieProps) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((mId) => mId !== movie.id)
    );
    console.log("Removing from favourites:", movie.id);

    /**
     * We retrieve the user data from the supabase database
     * https://supabase.com/docs/reference/javascript/auth-getuser
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user or error, we will get the below error
    if (!user || userError) {
      console.error("User not authenticated", userError);
      return;
    }

    /**
     * We delete the favourite movie from supabase
     * https://supabase.com/docs/reference/kotlin/delete
     */
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movie.id);

    if (error) {
      console.error("No data deleted from Supabase: ", error.message);
    }

    console.log(
      "Successfully deleted this movie from Supabase favourites: ",
      movie.title
    );
  }, []);

  const addToMustWatchList = useCallback(async (movie: BaseMovieProps) => {
    // First: Add to local state
    setMustWatchList((prevMustWatchList) => {
      // The old version checked against an array of IDs:
      // if (!prevMustWatchList.includes(movie.id)) {
      //   console.log("Adding to MustWatchList:", movie.id);
      //   return [...prevMustWatchList, movie.id];
      // }

      const alreadyExists = prevMustWatchList.find((m) => m.id === movie.id);
      if (!alreadyExists) {
        console.log("Adding to MustWatchList:", movie.title);
        return [...prevMustWatchList, movie];
      }
      return prevMustWatchList;
    });

    /**
     * We retrieve the user data from the supabase database
     * https://supabase.com/docs/reference/javascript/auth-getuser
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user or error, we will get the below error
    if (!user || userError) {
      console.error("User not authenticated", userError);
      return;
    }

    /**
     * This function will enable us to avoid duplicates. Essentially, we are
     * 'selecting' the id of the movie addition, and checking 'user_id' and 'movie_id'
     * to find the existing one and append maybeSingle() to return data as a single object
     * instead of an array of objects, meaning it won't get duplicated.
     * https://supabase.com/docs/reference/javascript/maybesingle
     */
    const { data: exist, error: selectError } = await supabase
      .from("mustwatch_movies")
      .select("id")
      .eq("user_id", user?.id)
      .eq("movie_id", movie.id)
      .maybeSingle();

    if (selectError) {
      console.error(
        "Error checking existing favourite: ",
        selectError?.message
      );
      return;
    }

    if (exist) {
      console.error(
        "This movie already exists in your mustWatch movies list: ",
        movie.title
      );
      return;
    }

    /**
     * We then insert the mustWatch movie to supabase based upon the table structure
     * we created in the supabase SQL Editor
     * https://supabase.com/docs/guides/auth/managing-user-data
     * https://supabase.com/docs/guides/database/postgres/row-level-security
     * https://supabase.com/docs/reference/javascript/insert
     */
    const { error } = await supabase.from("mustwatch_movies").insert({
      user_id: user?.id,
      movie_id: movie.id.toString(),
      movie_title: movie.title,
      poster_path: movie.poster_path,
    });

    if (error) {
      console.error("No data inserted in Supabase: ", error?.message);
    }

    console.log(
      "Successfully added this movie to Supabase mustWatch movies: ",
      movie.title
    );
  }, []);

  /**
   * Fetches the list of favourite movies for a given user from Supabase.
   * useCallBack() lets us cache a function definition between re-renders.
   *https://react.dev/reference/react/useCallback
   */
  const fetchSupabaseMustWatchMovies = useCallback(async (userId: string) => {
    /**
     * Use Supabase to query the "favourites" table
     * where the "user_id" column matches the provided userId
     * https://supabase.com/docs/reference/javascript/using-filters
     */
    const { data, error } = await supabase
      .from("mustwatch_movies")
      .select("movie_id, movie_title, poster_path")
      .eq("user_id", userId);

    // If error, we will get the below message
    if (error) {
      console.error("User not found", error.message);
      return;
    }

    // If data is successfully returned, map through the movie to extract the movie_id value,
    // and update the component's state const [favourites, setFavourites] = useState<number[]>([]);
    if (data) {
      // We amended this since we had declared the useState for the const favourites as an array of numbers
      // Also, 'm' is a better label than 'movie', which is an object, but we are essentially fetchin a value from
      // the supabase table row
      // const ids = data.map((m) => m.movie_id);
      const movies = data.map((m) => ({
        id: Number(m.movie_id),
        title: m.movie_title,
        poster_path: m.poster_path,
      }));
      setMustWatchList(movies);
    }
  }, []);

  /**
   * useEffect here enables to load the user's favourite movies when the component mounts.
   * Any time the `fetchSupabaseFavouriteMovies` function changes the favourites are fetched
   */
  useEffect(() => {
    const loadUserMustWatch = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found", userError?.message);
        return;
      }

      fetchSupabaseMustWatchMovies(user?.id);
    };

    loadUserMustWatch();

    /**
     * This sets up a listener to detect changes in the authentication user state
     * SIGNED_IN: Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab.
     * SIGNED_OUT: Emitted when the user signs out.
     * https://supabase.com/docs/reference/javascript/auth-onauthstatechange
     * */
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (event === "SIGNED_IN" && session) {
        fetchSupabaseMustWatchMovies(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setMustWatchList([]); // This will set the favourites list to empty
      }
    });

    // Call unsubscribe to remove the callback NOT WORKING
    // data.subscription.unsubscribe();

    /**
     * The above unsubscribe call was not correctly unsubscribing, and we were
     * ending up showing the same favourites list regardless of the user logging in.
     * Apparently, the correct logic is  return () => { // Cleanup logic };
     * https://devchallenges.io/learn/4-frontend-libraries/side-effects-in-react
     */

    return () => {
      data.subscription.unsubscribe();
    };
  }, [fetchSupabaseMustWatchMovies]); // dependency array

  // Function to remove amust watch movie from the must watch list
  const removeFromMustWatchList = useCallback(async (movie: BaseMovieProps) => {
    setMustWatchList((prevMustWatchList) =>
      prevMustWatchList.filter((m) => m.id !== movie.id)
    );
    console.log("Removing from must watch list:", movie.id);

    /**
     * We retrieve the user data from the supabase database
     * https://supabase.com/docs/reference/javascript/auth-getuser
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user or error, we will get the below error
    if (!user || userError) {
      console.error("User not authenticated", userError);
      return;
    }

    /**
     * We delete the favourite movie from supabase
     * https://supabase.com/docs/reference/kotlin/delete
     */
    const { error } = await supabase
      .from("mustwatch_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movie.id);

    if (error) {
      console.error("No data deleted from Supabase: ", error.message);
    }

    console.log(
      "Successfully deleted this movie from Supabase mustWatch list: ",
      movie.title
    );
  }, []);

  // Provide context values and render children
  return (
    <MoviesContext.Provider
      value={{
        favourites,
        addToFavourites,
        removeFromFavourites,
        addReview,
        mustWatchList,
        addToMustWatchList,
        removeFromMustWatchList,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

// Export the provider so it can be used in the component tree
export default MoviesContextProvider;
