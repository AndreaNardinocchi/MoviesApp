import React from "react";
import { Box, Grid, Typography, Link, Container, Divider } from "@mui/material";
// https://mui.com/material-ui/material-icons/?selected=VideoCameraFront
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
// Needed for MUI Link to use React Router navigation
// https://mui.com/material-ui/integrations/routing/#link
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";

/**
 * This hook gives us access to a function that can change the current URL programmatically,
 * without needing <Link> components. Useful for menu navigation handlers.
 */
// const navigate = useNavigate();

const Footer: React.FC = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "grey.900", color: "common.white", pt: 4 }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ paddingLeft: "3rem" }}>
              <Typography variant="h4" gutterBottom>
                {t("address")}
              </Typography>
              <Typography sx={{ fontSize: "1.3rem" }}>
                2 Church Gate,
                <br />
                Blackrock
                <br />
                Cork
                <br />
                {t("republic_of_ireland")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ paddingLeft: "3rem" }}>
              <Typography variant="h4" gutterBottom>
                {t("projects")}
              </Typography>
              <Link
                href="https://github.com/AndreaNardinocchi/MoviesApp"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the Placemark GitHub page"
                display="block"
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  MoviesApp GitHub
                </Typography>
              </Link>
              <Link
                href="https://instapi.glitch.me/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the #instaPi page"
                display="block"
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  #instaPi
                </Typography>
              </Link>
              <Link
                href="https://whether-weather-an.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the Whether Weather page"
                display="block"
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  (Whether) Weather
                </Typography>
              </Link>
              <Link
                href="https://evanescent-mercury-naranja.glitch.me/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the Weather Top page"
                display="block"
                sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  Weather Top App
                </Typography>
              </Link>
              <Link
                href="https://cinzianardinocchi.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the CN Psychology site"
                display="block"
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  CN Psychology
                </Typography>
              </Link>
              <Link
                href="https://placemarkyourjourney.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                aria-label="Opens on the CN Psychology site"
                display="block"
              >
                <Typography
                  sx={{ fontSize: "1.3rem", paddingBottom: "0.05rem" }}
                >
                  PlaceMark
                </Typography>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Divider sx={{ my: 0.01, borderColor: "grey.700" }} />
      <Box
        sx={{
          textAlign: "center",
          pb: 2,
          backgroundColor: "#363636",
        }}
      >
        <Box sx={{ height: 24, verticalAlign: "middle", mr: 1 }} />
        {/* <Link href="/" rel="noopener" sx={{ color: "inherit" }}> */}
        {/* <Link onClick={() => navigate("/")} to={""} rel="noopener"> */}

        {/* * We use MUI's <Link> component combined with React Router's <Link>
         * via the `component` prop to enable client-side navigation using the `to` prop.
         * This was used as a solution to the issue with the link to Homepage also
         * logging out the user
         * https://mui.com/material-ui/guides/routing/#link
         */}
        <Link
          component={RouterLink}
          to="/"
          rel="noopener"
          sx={{ color: "inherit" }}
        >
          <VideoCameraFrontIcon
            fontSize="small"
            color="inherit"
            sx={{
              marginTop: 0.03,
              verticalAlign: "middle",
              mr: 0.3,
              fontSize: 30,
            }}
          />
        </Link>
        <Typography variant="body2" component="span" sx={{ color: "inherit" }}>
          TMDB | © 2025 MoviesApp
        </Typography>
        <Link
          href="https://www.linkedin.com/in/andrea-nardinocchi-53084056/"
          target="_blank"
          rel="noopener"
          sx={{ color: "grey", ml: 0.5 }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#ebebeb" }}
          >
            Andrea Nardinocchi
          </Typography>
        </Link>
      </Box>{" "}
    </Box>
  );
};

export default Footer;
