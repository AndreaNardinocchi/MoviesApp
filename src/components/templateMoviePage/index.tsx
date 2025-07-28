// useState and useEffect are no longer redundant here, as they are essential for managing component state and side effects
import React, { useState, useEffect } from "react";
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getMovieImages } from "../../api/tmdb-api";
import { MovieDetailsProps } from "../../types/interfaces";
import { MovieImage } from "../../types/interfaces";
import { Box } from "@mui/material";

// Inline styles for image tiles
const styles = {
  gridListTile: {
    width: "100%",
    height: "100vh", // Takes full viewport height for image display
  },
};

// Interface to define the props expected by the TemplateMoviePage component
interface TemplateMoviePageProps {
  movie: MovieDetailsProps; // The movie data
  children: React.ReactElement; // TSX elements passed as children to be rendered on the right side
  overrideImages?: { file_path: string }[]; // This allows images to be passed in directly
}

// Functional component that defines a layout template for displaying a movie
const TemplateMoviePage: React.FC<TemplateMoviePageProps> = ({
  movie,
  children,
  overrideImages,
}) => {
  /**
   * === Why useState is needed ===
   * `images` holds the list of image objects to display in the left column.
   * `useState` creates a reactive state variable that causes the component to re-render when updated.
   * We need a reactive variable to store and render movie images. When the images arrive (either from the API
   * or passed via props), React needs to re-render the component to show them.
   */
  const [images, setImages] = useState<MovieImage[]>([]); // Initially an empty array

  /** === Why useEffect is needed ===
   * `useEffect` is used to perform a side effect fetching data from an API.
   * It runs after the component mounts and whenever `movie.id` or `overrideImages` changes.
   * We want to fetch data from the API when the component mounts or when movie.id or overrideImages change.
   */
  useEffect(() => {
    if (!movie || !movie.id) return;
    // If override images are provided, use them instead of fetching
    if (overrideImages) {
      setImages(overrideImages);
    } else {
      // Otherwise, fetch images related to the given movie ID
      getMovieImages(movie.id)
        .then((data) => setImages(data)) // On success, update the images state
        .catch((err) => console.error("Failed to fetch movie images", err));
    }
  }, [movie, overrideImages]); // Dependency array ensures effect runs only when `movie.id` or `overrideImages` changes
  console.log("TemplateMoviePage poster_path:", movie.poster_path);
  // TSX layout of the page
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          padding: 0,
          margin: 0,
          backgroundColor: "#ffffff",
        }}
      >
        {/* Movie header (title, poster, etc.) */}
        <MovieHeader {...movie} />

        <Grid container spacing={5} style={{ padding: "15px" }}>
          {/* Left column: image list */}
          <Grid item xs={3}>
            <ImageList
              cols={1}
              sx={{
                borderRadius: 2,
              }}
            >
              {images.length > 0 ? (
                // If images exist , display up to 10 of them
                images.slice(0, 10).map((image: MovieImage) => (
                  <ImageListItem
                    key={image.file_path}
                    sx={styles.gridListTile}
                    cols={1}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                      alt="Movie still"
                    />
                  </ImageListItem>
                ))
              ) : /**
               * If there are no images, use the poster_path.
               * This ensures that something is displayed in the left column,
               * especially when `getMovieImages()` returns an empty array.
               */
              movie.poster_path ? (
                <ImageListItem sx={styles.gridListTile}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt="Movie poster"
                  />
                </ImageListItem>
              ) : (
                <p></p>
              )}
            </ImageList>
          </Grid>

          {/* Right column: children content (e.g., movie details, reviews) */}
          <Grid item xs={9}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TemplateMoviePage;
