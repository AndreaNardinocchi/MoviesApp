import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
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
      <BrowserRouter>
        <AuthContextProvider>
          <SiteHeader /> {/* New Header  */}
          <MoviesContextProvider>
            <Routes>
              <Route path="/tvseries" element={<TVSeriesPage />} />
              <Route path="/tvseries/:id" element={<TVSeriesDetailsPage />} />
              <Route path="/actor/:id" element={<ActorBioPage />} />
              <Route path="/reviews/form" element={<AddMovieReviewPage />} />
              <Route path="/reviews/:id" element={<MovieReviewPage />} />
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
              <Route path="/actor/:id/movies" element={<ActorMoviesPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
            <Footer />
          </MoviesContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
