import React from "react";
import { Box, Grid, Typography, Link, Container, Divider } from "@mui/material";
// https://mui.com/material-ui/material-icons/?selected=VideoCameraFront
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "grey.900", color: "common.white", mt: 6, pt: 4 }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ paddingLeft: "3rem" }}>
              <Typography variant="h4" gutterBottom>
                Address
              </Typography>
              <Typography sx={{ fontSize: "1.3rem" }}>
                2 Church Gate,
                <br />
                Blackrock
                <br />
                Cork
                <br />
                Republic of Ireland
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ paddingLeft: "3rem" }}>
              <Typography variant="h4" gutterBottom>
                Projects
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
                  MovieApp GitHub
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
                href="cemarkyourjourney.netlify.app/login"
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
        <Link href="/" rel="noopener" sx={{ color: "inherit" }}>
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
          TMDB | © 2025 MovieApp
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
      </Box>
    </Box>
  );
};

export default Footer;
