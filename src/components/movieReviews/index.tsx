import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { getMovieReviews } from "../../api/tmdb-api";
import { excerpt } from "../../util";
import { MovieDetailsProps, Review } from "../../types/interfaces"; // Import the MovieT type from the appropriate location
import { useTranslation } from "react-i18next";
// import i18n from "../i18n/i18n";

const styles = {
  table: {
    minWidth: 550,
  },
};

const MovieReviews: React.FC<MovieDetailsProps> = (movie) => {
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

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getMovieReviews(movie.id, lang).then((reviews) => {
      setReviews(reviews);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * The hyperlinks use the extended option of the React Router Link component.
   * It allows us to pass two props (movie and review) to the movie review page component
   * */
  return (
    <TableContainer component={Paper}>
      <Table sx={styles.table} aria-label="reviews table">
        <TableHead>
          <TableRow>
            <TableCell>{t("author")}</TableCell>
            <TableCell align="center">{t("excerpt")}</TableCell>
            <TableCell align="right">{t("more")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((r: Review) => (
            <TableRow key={r.id}>
              <TableCell component="th" scope="row">
                {r.author}
              </TableCell>
              <TableCell>{excerpt(r.content)}</TableCell>
              <TableCell>
                <Link
                  to={`/reviews/${r.id}`}
                  state={{
                    review: r,
                    movie: movie,
                  }}
                >
                  {t("full_review")}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MovieReviews;

// The above component maps over the array of reviews retrieved from the API.
