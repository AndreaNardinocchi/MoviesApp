import React, { MouseEvent, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { BaseMovieProps } from "../../types/interfaces";

const AddToFavouritesIcon: React.FC<BaseMovieProps> = (movie) => {
  const context = useContext(MoviesContext);

  const onUserSelect = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.addToFavourites(movie);
  };
  return (
    <IconButton aria-label="add to favorites" onClick={onUserSelect}>
      <FavoriteIcon
        //  color="inherit"
        sx={{ color: "#8E4585" }}
        fontSize="large"
      />
    </IconButton>
  );
};

export default AddToFavouritesIcon;

// import React, { MouseEvent, useContext } from "react";
// import { MoviesContext } from "../../contexts/moviesContext";
// import IconButton from "@mui/material/IconButton";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import { BaseMovieProps } from "../../types/interfaces";
// import { supabase } from "../../supabaseClient";

// // const user = supabase.auth.getUser();

// const AddToFavouritesIcon: React.FC<BaseMovieProps> = (movie) => {
//   const context = useContext(MoviesContext);

//   const onUserSelect = async (e: MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     // context.addToFavourites(movie);
//     context.addToFavourites(movie);

//     const {
//       // Get current logged-in user

//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     // If error, an error message will be shown
//     if (userError) {
//       console.error("Favoutites error:", userError.message);
//       return;
//     }

//     const { data, error } = await supabase
//       .from("favourites")
//       .insert([
//         {
//           user_id: user?.id,
//           movie_id: movie.id,
//           movie_title: movie.title,
//           poster_path: movie.poster_path,
//         },
//       ])
//       .select(); // Returns inserted rows;

//     if (error) {
//       console.error("Error adding favorite:", error);
//     } else {
//       console.log("Favorite added:", data);
//       // Optionally update UI or notify user here
//     }
//   };
//   return (
//     //   <IconButton aria-label="add to favorites" onClick={onUserSelect}>
//     <IconButton aria-label="add to favorites" onClick={onUserSelect}>
//       <FavoriteIcon
//         //  color="inherit"
//         sx={{ color: "#8E4585" }}
//         fontSize="large"
//       />
//     </IconButton>
//   );
// };

// export default AddToFavouritesIcon;
