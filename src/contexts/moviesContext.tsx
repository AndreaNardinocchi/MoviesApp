import React, { useState, useCallback } from "react";
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

  // Function to add a review for a movie
  const addReview = (movie: BaseMovieProps, review: Review) => {
    setMyReviews({ ...myReviews, [movie.id]: review });
  };

  // Function to remove a movie from the favourites list
  const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((mId) => mId !== movie.id)
    );
    console.log("Removing from favourites:", movie.id);
  }, []);

  // Function to add a movie to the must-watch list, ensuring no duplicates
  const addToMustWatchList = useCallback((movie: BaseMovieProps) => {
    setMustWatchList((prevMustWatchList) => {
      // The old version checked against an array of IDs:
      // if (!prevMustWatchList.includes(movie.id)) {
      //   console.log("Adding to MustWatchList:", movie.id);
      //   return [...prevMustWatchList, movie.id];
      // }

      // The new version checks for the movie object by ID
      if (!prevMustWatchList.find((m) => m.id === movie.id)) {
        console.log("Adding to MustWatchList:", movie);
        return [...prevMustWatchList, movie];
      }
      return prevMustWatchList;
    });
  }, []);

  // Function to remove amust watch movie from the must watch list
  const removeFromMustWatchList = useCallback((movie: BaseMovieProps) => {
    setMustWatchList((prevMustWatchList) =>
      prevMustWatchList.filter((m) => m.id !== movie.id)
    );
    console.log("Removing from must watch list:", movie.id);
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
