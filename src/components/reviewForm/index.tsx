import React, { useContext, useState, ChangeEvent, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { MoviesContext } from "../../contexts/moviesContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
// import ratings from "./ratingCategories"; // These ratings are statically loaded and not translatable
import { BaseMovieProps, Review } from "../../types/interfaces";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
/**
 * We pull in ratings from the new useRatings hook, which is a component that
 * enables the use of the useTranslation() function to translate the ratings
 */
import useRatings from "../../hooks/useRatings";

const ReviewForm: React.FC<BaseMovieProps> = (movie) => {
  /**
   * We create this variable 'ratings', which calls in the hook useRatings(), 
   * which is actually going to replace the 'ratings' array we were previously
   * pulling from ratings.ts.
   * This change will ensure that the below dropdown menu :
   * {ratings.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
   * will actually pull values from useRatings.ts
   *  */
  const ratings = useRatings();
  /**
   * Get the current language from the i18n instance such as 'en-US', 'es-ES', and so on,
   * If undefined or empty, fallback to 'en-US'
   * */
  const { i18n } = useTranslation();

  // const lang = i18n.language || "en-US";

  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  const { t } = useTranslation();
  console.log("Current language:", i18n.language);

  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `${t("reviews")} | MovieApp`;
  }, [t]);

  const defaultValues = {
    defaultValues: {
      author: "",
      review: "",
      agree: false,
      rating: 3,
      movieId: 0,
    },
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Review>(defaultValues);

  const navigate = useNavigate();
  const context = useContext(MoviesContext);
  const [rating, setRating] = useState(3);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(event.target.value));
  };

  const [open, setOpen] = useState(false); //NEW

  const handleSnackClose = () => {
    setOpen(false);
    navigate("/movies/favourites");
  };

  const onSubmit: SubmitHandler<Review> = (review) => {
    review.movieId = movie.id;
    review.rating = rating;
    context.addReview(movie, review);
    // On submit, we also add a reviewKey to the localStorage to store our review
    const reviewKey = `review_movie_${movie.id}`;
    // Hence, below we set the key and we stringify its value which is the review object
    // https://stackoverflow.com/questions/23728626/localstorage-and-json-stringify-json-parse#23728844
    localStorage.setItem(reviewKey, JSON.stringify(review));
    setOpen(true); // NEW
    console.log(review);
  };

  /**
   * The useForm hook in the above code is the cornerstone. The properties of the object it returns
   * connect the hook’s form processing logic to our web form. The properties include:
   * handleSubmit - a function to connect our custom form submit event handler to react-hook-form.
   * reset - a function to reset the form fields.
   * errors - an object populated with field validation error messages computed from the validation rules
   * declared in the Controller components.
   * control - a function for controlling a field on the web fork.
   * The react-hook-form library also provides the Controller component for managing a form field.
   * It declares the field’s validation criteria (rules), name, and how it should render (render).
   */
  return (
    <>
      <Box component="div" sx={styles.root}>
        <Typography component="h2" variant="h3">
          {t("write_review")}
        </Typography>
        <Snackbar
          sx={styles.snack}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={handleSnackClose}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={handleSnackClose}
            sx={{
              bgcolor: "#4CAF50",
              color: "#ffffff",
            }}
          >
            <Typography variant="h4">{t("thank_you_for_review")}</Typography>
          </Alert>
        </Snackbar>

        <form style={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="author"
            control={control}
            rules={{ required: t("name_required") }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                sx={{ width: "100%" }}
                variant="outlined"
                margin="normal"
                required
                onChange={onChange}
                value={value}
                id="author"
                label={t("author_name")}
                autoFocus
              />
            )}
          />
          {errors.author && (
            <Typography variant="h6" component="p">
              {errors.author.message}
            </Typography>
          )}
          <Controller
            name="content"
            control={control}
            rules={{
              required: t("review_empty"),
              minLength: { value: 10, message: t("review_short") },
            }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={value}
                onChange={onChange}
                label={t("review_text")}
                id="review"
                multiline
                minRows={10}
              />
            )}
          />
          {/* The render prop above is an example of the Render prop pattern. 
        The callback assigned to it is invoked by the Controller, passing it 
        the current value of the field and a default onChange event handler. 
        The validation rules object above uses prescribed keys (e.g. required, minlength, min, max). 
        The hook enforces these rules, and it records any violations in an errors object, 
        which we use to control the display of error messages, for example: */}
          {errors.content && (
            <Typography variant="h6" component="p">
              {errors.content.message}
            </Typography>
          )}

          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <TextField
                {...field}
                id="select-rating"
                select
                variant="outlined"
                label={t("rating_select")}
                value={rating}
                onChange={handleRatingChange}
                helperText={t("not_forget_rating")}
              >
                {ratings.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Box>
            <Button
              type="submit"
              variant="contained"
              // color="primary"
              sx={{
                // Spread styles.chipLabel keeps the original chip styling
                ...styles.submit,
                bgcolor: "#8E4585",
                color: "#ffffff",
                // https://mui.com/system/getting-started/the-sx-prop/?
                "&:hover": {
                  // Text color on hover
                  color: "#000000",
                  // Change background slightly on hover
                  bgcolor: "#ffe6f0",
                },
              }}
              // sx={styles.submit}
            >
              {t("submit")}
            </Button>
            <Button
              type="reset"
              variant="contained"
              //  color="secondary"
              //  sx={styles.submit}
              sx={{
                // Spread styles.chipLabel keeps the original chip styling
                ...styles.submit,
                bgcolor: "#D86EBF",
                color: "#ffffff",
                // https://mui.com/system/getting-started/the-sx-prop/?
                "&:hover": {
                  // Text color on hover
                  color: "#000000",
                  // Change background slightly on hover
                  bgcolor: "#ffe6f0",
                },
              }}
              onClick={() => {
                reset({
                  author: "",
                  content: "",
                });
              }}
            >
              {t("reset")}
            </Button>
          </Box>
        </form>
      </Box>
      <Button
        onClick={() => navigate("/movies/favourites")}
        sx={{
          textDecoration: "none",
          color: "#8E4585",
          fontWeight: "bold",
          textAlign: "right",
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        ← {t("back")}
      </Button>
    </>
  );
};

export default ReviewForm;
