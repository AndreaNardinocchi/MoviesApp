import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { BaseMovieProps } from "../../types/interfaces";
import { Link } from "react-router-dom";

const WriteReviewIcon: React.FC<BaseMovieProps> = (movie) => {
  return (
    <Link
      to={`/movies/favourites/reviews/form`}
      state={{
        movieId: movie.id,
      }}
    >
      <RateReviewIcon sx={{ color: "#8E4585" }} fontSize="large" />
    </Link>
  );
};

export default WriteReviewIcon;
