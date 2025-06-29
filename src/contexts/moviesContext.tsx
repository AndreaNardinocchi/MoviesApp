// Import necessary modules and hooks from React
import React, { useState, useCallback } from "react";
// Import custom TypeScript interfaces for type safety
import { BaseMovieProps, Review } from "../types/interfaces";

// Define the structure of the context's value using an interface
// This describes what data and functions are available in the context
interface MovieContextInterface {
  favourites: number[]; // List of favourite movie IDs
  mustWatchList: number[]; // List of must-watch movie IDs
  addToFavourites: (movie: BaseMovieProps) => void; // Function to add a movie to favourites
  addToMustWatchList: (movie: BaseMovieProps) => void; // Function to add a movie to must-watch list
  removeFromFavourites: (movie: BaseMovieProps) => void; // Function to remove a movie from favourites
  addReview: (movie: BaseMovieProps, review: Review) => void; // Function to add a review to a movie
}

// Define an initial state for the context with empty/default implementations
// This prevents undefined access before the provider is mounted
const initialContextState: MovieContextInterface = {
  favourites: [],
  mustWatchList: [],
  addToFavourites: () => {}, // Placeholder function
  addToMustWatchList: () => {}, // Placeholder function
  removeFromFavourites: () => {}, // Placeholder function
  addReview: (movie, review) => {
    // Placeholder function for review addition
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
  // State to store the list of must-watch movie IDs
  const [mustWatchList, setMustWatchList] = useState<number[]>([]);

  // Function to add a movie to the favourites list, ensuring no duplicates
  const addToFavourites = useCallback((movie: BaseMovieProps) => {
    setFavourites((prevFavourites) => {
      if (!prevFavourites.includes(movie.id)) {
        console.log("Adding to favourites:", movie.id);
        return [...prevFavourites, movie.id];
      }
      return prevFavourites;
    });
  }, []);

  // Function to add a review for a movie
  const addReview = (movie: BaseMovieProps, review: Review) => {
    // This logic is likely incorrect — using object spread syntax on an array
    // It assumes myReviews is an object mapping movie ID to review, but it's typed as an array
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
      if (!prevMustWatchList.includes(movie.id)) {
        console.log("Adding to MustWatchList:", movie.id);
        return [...prevMustWatchList, movie.id];
      }
      return prevMustWatchList;
    });
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
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

// Export the provider so it can be used in the component tree
export default MoviesContextProvider;
