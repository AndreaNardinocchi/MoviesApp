import React, { useState } from "react";
// React Router hooks for accessing route parameters and navigation
import { useParams, useNavigate } from "react-router-dom";
// React Query hook for data fetching and caching
import { useQuery } from "react-query";
import TemplateMoviePage from "../components/templateMoviePage";
import Spinner from "../components/spinner";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
// MUI icons for modal navigation
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// API methods to fetch actor details and their images
import { fetchActorDetails, getPersonImages } from "../api/tmdb-api";
import { MovieDetailsProps } from "../types/interfaces";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

/**
 * Even though React Query handles the data fetching (useQuery), we're building an
 * interactive photo gallery with modal behavior, which is purely client-side state,
 * and this is where useState kicks in.
 * */

const ActorBioPage: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside your functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  // Get the actor ID from the URL params
  const { id } = useParams<{ id: string }>();

  // Hook to navigate pages
  const navigate = useNavigate();

  /**
   * We now use 2 Queries since we need to use different API endpoints:
   * - fetchActorDetails (This is an object with bio fields)
   * - getPersonImages (This is an array of images)
   * Separate loading/error handling, as we want to show errors/loading independently for each
   * */

  // Fetch actor details from the API using the ID
  const {
    data: actor,
    error,
    isLoading,
    isError,
  } = useQuery(
    ["actorDetails", id], // Unique key used by React Query to cache the response
    () => fetchActorDetails(id || "") // API function to get actor info from '/api/tmdb-api'
  );

  // Fetch images associated with the actor
  const {
    data: imagesData, // Rename the result to imagesData so we don’t confuse it with the actor data
    isLoading: imagesLoading, // Rename isLoading to imagesLoading the queries don’t clash
    isError: imagesError, // Likewise, rename isError to imagesError
  } = useQuery(
    ["actorImages", id], // Unique key by React Query to track and cache this response
    () => getPersonImages(Number(id)) // The API function here needs a number
    // {
    //   enabled: !!id,
    // }
  );

  /**
   * State to control image modal visibility
   * modalOpen → controls if the image modal is shown
   */
  const [modalOpen, setModalOpen] = useState(false); // Every render would reset it back to false

  /**
   * currentIndex tracks the currently selected image index in the gallery
   * If you didn’t use useState, React wouldn’t remember which image to show or whether the
   * modal is open between renders.
   * */
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show spinner while either actor info or images are loading
  if (isLoading || imagesLoading) return <Spinner />;

  // Show error messages if fetching actor details failed
  if (isError)
    return (
      <Typography variant="h6" color="error">
        {(error as Error).message}
      </Typography>
    );

  // Show error messages if fetching actor images failed
  if (imagesError)
    return (
      <Typography variant="h6" color="error">
        {t("failed_image_loading")}
      </Typography>
    );

  // Extract actor profile images (array of image objects)
  const actorImages = imagesData?.profiles || [];

  // First image is used for the left image section of the template
  const firstImage = actorImages.length > 0 ? actorImages[0] : undefined;

  /**
   * All other images will be shown in the photo gallery
   * The .slice() method returns a shallow copy of a portion of an array into a new array object.
   * https://www-igm.univ-mlv.fr/~forax/MDN/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice.html
   * */
  const galleryImages = actorImages.slice(1);

  //
  /**
   * A dummy movie object to pass to the template is needed in our ActorBioPage component because the page is built
   * using the shared layout/template component <TemplateMoviePage />, which expects a valid movie object as a prop. This is to abyde by
   * the DRY principle and not to create duplicated template when possible.
   * Here, though, we are not using movie data, but the template still requires a movie prop of type MovieDetailsProps.
   * After all, we still need to provide data that matches the structure of the templateMoviePage, although it is the actorBioPage we are showing here.
   * Hence, a placeholder is created to satisfy the type and structural requirements of the TemplateMoviePage without feeding the page with any movie data.
   * We will then be adding some <Typography /> to add actor bio data we need and <imageList /> and <ImageListIte /> to create the actor umages grid
   */
  const dummyMovie: MovieDetailsProps = {
    id: 0,
    title: actor?.name || "Actor Bio",
    budget: 0,
    homepage: undefined,
    imdb_id: "",
    original_language: "",
    overview: "",
    release_date: "",
    vote_average: 0,
    popularity: 0,
    poster_path: firstImage ? firstImage.file_path : undefined, // Actor image as poster
    tagline: "",
    runtime: 0,
    revenue: 0,
    vote_count: 0,
    genres: [],
    production_countries: [],
    cast: [],
    release: [],
  };

  // Opens the image modal and displays the selected image
  // https://reactjsexample.com/a-lightweight-react-hook-for-modals-dialogs/
  // https://react.dev/learn/state-a-components-memory
  // https://thewebdev.info/2021/01/26/create-an-image-modal-with-react-and-javascript/
  // https://learnersbucket.com/examples/interview/create-a-lightbox-modal-image-gallery-in-reactjs/
  const openModal = (index: number) => {
    setCurrentIndex(index); // Store the index of the clicked image so we can track which image is shown
    setModalOpen(true); // Set the modal's visibility to true so it appears on screen
  };

  // Moves to the previous image in the gallery
  // If currently at the first image, wrap around to the last
  // https://www.freecodecamp.org/news/build-an-image-carousel-with-react-and-framer-motion
  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Moves to the next image in the gallery
  // If currently at the last image, wrap around to the first
  // https://www.freecodecamp.org/news/build-an-image-carousel-with-react-and-framer-motion
  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  // Closes the image modal
  const closeModal = () => {
    setModalOpen(false); // Hides the modal by updating its visibility state
  };

  // Component render
  return (
    <TemplateMoviePage
      movie={dummyMovie}
      overrideImages={firstImage ? [firstImage] : []}
    >
      <>
        {/* Actor name */}
        <Typography variant="h4" component="h1" gutterBottom>
          {actor?.name || t("unknown_actor")}
        </Typography>

        {/* Actor birth details */}
        <Typography variant="subtitle1" gutterBottom>
          {t("actor_birthday")} {actor?.birthday || t("unknown_actor")}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          {t("birthplace")} {actor?.place_of_birth || t("unknown_actor")}
        </Typography>

        {/* Biography */}
        <Typography variant="body1" paragraph>
          {t("biography")}
        </Typography>

        <Typography variant="body2" paragraph>
          {actor?.biography ? actor.biography : "No biography available."}
        </Typography>

        {/* Photo gallery section */}
        {galleryImages.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              {t("photogallery")}
            </Typography>

            {/* Responsive image grid */}
            <ImageList cols={3} gap={10}>
              {galleryImages.map(
                (
                  img: { file_path: React.Key | null | undefined },
                  index: number
                ) => (
                  <ImageListItem key={img.file_path}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                      alt={actor?.name}
                      loading="lazy"
                      style={{ borderRadius: 10, cursor: "pointer" }}
                      onClick={() => openModal(index)} // Open modal on click
                    />
                  </ImageListItem>
                )
              )}
            </ImageList>
          </>
        )}

        {/* Back button to return to previous page */}
        <Button
          variant="outlined"
          onClick={() => navigate(-1)} // Go back one page in browser history
          style={{ marginBottom: 16, marginRight: 8 }}
          sx={{
            color: "#8E4585",
          }}
        >
          {t("back_to_movie_page")}
        </Button>

        {/* Button to land the user to the actor movies page */}
        <Button
          variant="outlined"
          onClick={() => navigate(`/actor/${id}/movies`)}
          style={{ marginBottom: 16 }}
          sx={{
            color: "#8E4585",
          }}
        >
          {t("actor_movie_page_cta")}
        </Button>

        {/**
         * Zoom modal for viewing images larger with arrow controls
         * https://reactjsexample.com/a-lightweight-react-hook-for-modals-dialogs/
         * https://react.dev/learn/state-a-components-memory
         * https://thewebdev.info/2021/01/26/create-an-image-modal-with-react-and-javascript/
         * https://learnersbucket.com/examples/interview/create-a-lightbox-modal-image-gallery-in-reactjs/
         *
         *  */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1500,
            }}
          >
            {/* Close modal button */}
            <IconButton
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "white",
              }}
              aria-label="close"
            >
              <CloseIcon fontSize="large" />
            </IconButton>

            {/* Previous image button */}
            <IconButton
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: 20,
                color: "white",
              }}
              aria-label="previous"
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </IconButton>

            {/* Fullscreen image display */}
            <img
              src={`https://image.tmdb.org/t/p/original${galleryImages[currentIndex].file_path}`}
              alt={actor?.name}
              style={{
                maxHeight: "100vh",
                maxWidth: "100vw",
              }}
            />

            {/* Next image button */}
            <IconButton
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: 20,
                color: "white",
              }}
              aria-label="next"
            >
              <ArrowForwardIosIcon fontSize="large" />
            </IconButton>
          </div>
        )}
      </>
    </TemplateMoviePage>
  );
};

export default ActorBioPage;
