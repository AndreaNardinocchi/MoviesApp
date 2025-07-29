import React, { useState, useEffect } from "react";
import TVSeriesHeader from "../headerTVSeries"; // Your TV series header component
import Grid from "@mui/material/Grid";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { getTVSeriesImages } from "../../api/tmdb-api"; // TV series images fetcher
import { TVSeriesDetailsProps } from "../../types/interfaces";
import { MovieImage } from "../../types/interfaces";
import { Box } from "@mui/material";

const styles = {
  gridListTile: {
    width: "100%",
    height: "100vh",
  },
};

// Props definition for the TemplateTVSeriesPage component
interface TemplateTVSeriesPageProps {
  series: TVSeriesDetailsProps; // The TV series details to display (e.g., title, description, ID)
  children: React.ReactElement; // React child component(s) to render within the template
  overrideImages?: { file_path: string }[]; // Array of image objects to override default actor or series images
}

// Functional component to render a TV series page layout with optional custom images
const TemplateTVSeriesPage: React.FC<TemplateTVSeriesPageProps> = ({
  series,
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
  const [images, setImages] = useState<MovieImage[]>([]);

  /** === Why useEffect is needed ===
   * `useEffect` is used to perform a side effect fetching data from an API.
   * It runs after the component mounts and whenever `movie.id` or `overrideImages` changes.
   * We want to fetch data from the API when the component mounts or when movie.id or overrideImages change.
   */
  useEffect(() => {
    if (overrideImages) {
      // If overrideImages are provided via props, use them directly
      setImages(overrideImages);
    } else {
      // Otherwise, fetch images for the TV series using its ID
      getTVSeriesImages(series.id)
        .then((data) => setImages(data)) // Update state with fetched images
        .catch(
          (err) => console.error("Failed to fetch TV series images", err) // Log any errors encountered during fetch
        );
    }
  }, [series.id, overrideImages]); // Re-run effect if series ID or overrideImages change

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
        {/* TVSeries header (title, poster, etc.) */}
        <TVSeriesHeader {...series} />

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
               * especially when ` getTVSeriesImages()` returns an empty array.
               */
              series.poster_path ? (
                <ImageListItem sx={styles.gridListTile}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
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

export default TemplateTVSeriesPage;

/**
 * This component has been created by cloning the templateMoviePage one and making the needed adjustments to
 * work with the TVSeriesDetailsProps
 */
