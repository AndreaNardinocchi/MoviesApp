import React, { useEffect, useState } from "react";
// React Router hooks for accessing route parameters and navigation
import { useParams, Link } from "react-router-dom";
// React Query hook for data fetching and caching
import { useQuery } from "react-query";
import TemplateTVSeriesPage from "../components/templateTVSeriesPage";
import Spinner from "../components/spinner";
import Typography from "@mui/material/Typography";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
// MUI icons for modal navigation
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// API methods to fetch actor details and their images
import {
  fetchActorDetails,
  getTVSeries,
  getPersonImages,
} from "../api/tmdb-api";
import { TVSeriesDetailsProps } from "../types/interfaces"; // NEW: TV-specific type
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

/**
 * Even though React Query handles the data fetching (useQuery), we're building an
 * interactive photo gallery with modal behavior, which is purely client-side state,
 * and this is where useState kicks in.
 * */

const TVSeriesActorBioPage: React.FC = () => {
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();
  const lang = i18n.language || "en-US";

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  const { tvId, actorId } = useParams() as {
    tvId: string;
    actorId: string;
  };

  console.log("ids: ", tvId, actorId);

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
  } = useQuery(["actorDetails", actorId, lang], () =>
    fetchActorDetails(actorId || "", lang)
  );

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${actor?.name} | MoviesApp `;
  }, [actor?.name]);

  // Fetch images associated with the actor
  const {
    data: imagesData,
    isLoading: imagesLoading,
    isError: imagesError,
  } = useQuery(["actorImages", actorId], () =>
    getPersonImages(Number(actorId))
  );

  // Fetch TV series data using React Query's useQuery hook
  useQuery(
    ["tv", tvId, lang],
    // Fetch the TV series id
    () => getTVSeries(tvId, lang)
  );

  /**
   * State to control image modal visibility
   * modalOpen → controls if the image modal is shown
   */
  const [modalOpen, setModalOpen] = useState(false);

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

  /**
   * A dummy movie object to pass to the template is needed in our ActorBioPage component because the page is built
   * using the shared layout/template component <TemplateMoviePage />, which expects a valid movie object as a prop. This is to abyde by
   * the DRY principle and not to create duplicated template when possible.
   * Here, though, we are not using movie data, but the template still requires a movie prop of type MovieDetailsProps.
   * After all, we still need to provide data that matches the structure of the templateMoviePage, although it is the actorBioPage we are showing here.
   * Hence, a placeholder is created to satisfy the type and structural requirements of the TemplateMoviePage without feeding the page with any movie data.
   * We will then be adding some <Typography /> to add actor bio data we need and <imageList /> and <ImageListIte /> to create the actor umages grid
   */
  const dummyTVSeries: TVSeriesDetailsProps = {
    id: 0,
    name: actor?.name || "Actor Bio", // TV equivalent of title
    overview: "",
    genres: [],
    first_air_date: "",
    vote_average: 0,
    poster_path: firstImage ? firstImage.file_path : undefined,
    cast: [],
    production_countries: [],
    homepage: "",
    tagline: "",
    number_of_seasons: 0,
    number_of_episodes: 0,
    title: "",
    genre_ids: [],
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

  console.log("Routing path:", window.location.pathname);

  // Component render
  return (
    <>
      <TemplateTVSeriesPage
        series={dummyTVSeries}
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
            {actor?.biography ? actor.biography : t("no_biography")}
          </Typography>

          {/* Photo gallery section */}
          {galleryImages.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                {t("photogallery")}
              </Typography>

              <Box
                sx={{
                  // Use CSS Grid layout to arrange the imageList children component
                  display: "grid",
                  gap: 2,
                  /**
                   * Define the number and size of columns responsively.
                   * '1fr' means one fraction of the available space, which is translated into
                   * 1 column, and so on.
                   * https://mui.com/system/getting-started/the-sx-prop/
                   * https://mui.com/system/react-box/
                   * */
                  gridTemplateColumns: {
                    xs: "1fr", // 1 column on mobile
                    sm: "1fr 1fr", // 2 columns on tablets
                    md: "1fr 1fr 1fr", // 3 columns on desktop: "1fr",
                  },
                }}
              >
                {galleryImages.map(
                  (
                    img: { file_path: React.Key | null | undefined },
                    index: number
                  ) => (
                    <ImageListItem key={img.file_path}>
                      <Box
                        component="img"
                        src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                        alt={actor?.name}
                        loading="lazy"
                        onClick={() => openModal(index)}
                        sx={{
                          borderRadius: 2,
                          cursor: "pointer",
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    </ImageListItem>
                  )
                )}
              </Box>
            </>
          )}

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

              <img
                src={`https://image.tmdb.org/t/p/original${galleryImages[currentIndex].file_path}`}
                alt={actor?.name}
                style={{ maxHeight: "100vh", maxWidth: "100vw" }}
              />

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
      </TemplateTVSeriesPage>

      {/* Sticky Bottom Bar */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          textAlign: "left",
          boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.06)",
          display: "flex", // Use flexbox
          //          justifyContent: "flex-end", // Push content to the right
          justifyContent: "space-between", // <-- spread left and right
          alignItems: "center", // Vertically center the content
          padding: {
            xs: "3% 4%",
            sm: "2% 1.8%",
            md: "1.5% 1.0%",
            lg: "0.7% 0.8%",
          },
        }}
      >
        <Link
          to={tvId ? `/tvseries/${tvId}` : `/`}
          style={{
            textDecoration: "none",
            color: "#8E4585",
            fontWeight: "bold",
            textAlign: "right",
          }}
        >
          ← {t("back")}
        </Link>

        <Link
          to={`/tvseries/${tvId}/actor/${actorId}/tvseries`}
          style={{
            textDecoration: "none",
            color: "#8E4585",
            fontWeight: "bold",
          }}
        >
          {t("jump_to_actor_tvseries_page")} →
        </Link>
      </Box>
    </>
  );
};

export default TVSeriesActorBioPage;
