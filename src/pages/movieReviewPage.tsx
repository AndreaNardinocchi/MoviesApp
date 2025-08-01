import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const MovieReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    state: { movie, review },
  } = useLocation();
  return (
    <>
      <PageTemplate movie={movie}>
        <MovieReview {...review} />
      </PageTemplate>

      {/* Sticky Bar */}
      {/* https://mui.com/system/react-box/ */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "#ffffff",
          boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.06)",
          display: "flex", // Use flexbox
          justifyContent: "flex-start", // Push content to the left
          alignItems: "center", // Vertically center the content
          padding: {
            xs: "3% 4%", // small devices
            sm: "2% 1.8%", // tablets
            md: "1.5% 1.0%", // medium screens
            lg: "0.7% 0.8%", // large screens
          },
        }}
      >
        <Button
          onClick={() => {
            navigate(-1);
          }}
          style={{
            textTransform: "none",
            textDecoration: "none",
            color: "#8E4585",
            fontWeight: "bold",
            textAlign: "right",
          }}
        >
          ← {t("back")}
        </Button>
      </Box>
    </>
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
