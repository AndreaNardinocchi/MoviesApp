import React from "react";
import { useLocation } from "react-router-dom";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";

const MovieReviewPage: React.FC = () => {
  const {
    state: { movie, review },
  } = useLocation();
  return (
    <PageTemplate movie={movie}>
      <MovieReview {...review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;

/**
 * The useLocation hook used above returns the new ‘state’
 * of the browser’s URL address after a link is clicked.
 * As explained in the previous section, the state includes
 * two object references - movie and review. Our code uses
 * destructuring to access these references. Also, we use component
 * composition above, this time between the template and the MovieReview components.
 */
