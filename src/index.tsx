import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
// import HomePage from "./pages/discoverPage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage"; // NEW
import MovieReviewPage from "./pages/movieReviewPage";
import SiteHeader from "./components/siteHeader";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import ActorBioPage from "./pages/actorBioPage";
import MustWatchListPage from "./pages/mustWatchList";
import NowPlayingMoviesPage from "./pages/nowPlayingMoviesPage";
import TVSeriesPage from "./pages/tvSeriesPage";
import TVSeriesDetailsPage from "./pages/TVSeriesDetailsPage";
import ActorMoviesPage from "./pages/actorMoviesPage";
import LoginPage from "./pages/loginPage";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AuthContextProvider from "./contexts/authContext";
import SignUpPage from "./pages/signUpPage";
import Footer from "./components/footer/footer";
import i18n from "./i18n/i18n";
import { I18nextProvider } from "react-i18next";
import { Box, CssBaseline } from "@mui/material";
// import Test from "./pages/homePage";
import DiscoverMovies from "./pages/discoverPage";
import HomePage from "./pages/homePage";
import TVSeriesActorBioPage from "./pages/TVSeriesActorBioPage";
import ActorTVSeriesPage from "./pages/actorTVSeriesPage";

// declare the query client (it will manage the cache in the browser):
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          minHeight: "100vh",
          padding: 0,
          margin: 0,
          backgroundColor: "#bfbfbf",
        }}
      >
        {/*  Reset browser styles 
      The Css Baseline component helps to kickstart an elegant, consistent, and simple baseline to build upon.
      https://mui.com/material-ui/react-css-baseline/
      */}
        <CssBaseline />
        <BrowserRouter>
          <AuthContextProvider>
            <SiteHeader /> {/* New Header  */}
            <MoviesContextProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tvseries" element={<TVSeriesPage />} />
                <Route path="/tvseries/:id" element={<TVSeriesDetailsPage />} />
                <Route
                  path="/movies/:movieId/actor/:actorId"
                  element={<ActorBioPage />}
                />
                <Route
                  path="/tvseries/:tvId/actor/:actorId"
                  element={<TVSeriesActorBioPage />}
                />
                <Route
                  path="/tvseries/:tvId/actor/:actorId/tvseries"
                  element={<ActorTVSeriesPage />}
                />
                <Route
                  path="/movies/favourites/reviews/form"
                  element={<AddMovieReviewPage />}
                />
                <Route path="/reviews/:id" element={<MovieReviewPage />} />
                <Route path="/movies/discover" element={<DiscoverMovies />} />
                <Route
                  path="/movies/upcoming"
                  element={
                    <ProtectedRoute>
                      <UpcomingMoviesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/mustwatchlist"
                  element={
                    <ProtectedRoute>
                      <MustWatchListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/nowplaying"
                  element={
                    <ProtectedRoute>
                      <NowPlayingMoviesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/favourites"
                  element={
                    <ProtectedRoute>
                      <FavouriteMoviesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/:id"
                  element={
                    <ProtectedRoute>
                      <MoviePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/movies/:movieId/actor/:actorId/movies"
                  element={<ActorMoviesPage />}
                />

                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Routes>
              <Footer />
            </MoviesContextProvider>
          </AuthContextProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </Box>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* https://react.i18next.com/latest/i18nextprovider */}
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
