import React, { useContext, useState, ChangeEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { MoviesContext } from "../../contexts/moviesContext";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import ratings from "./ratingCategories";
import { BaseMovieProps, Review } from "../../types/interfaces";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ReviewForm: React.FC<BaseMovieProps> = (movie) => {
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
    <Box component="div" sx={styles.root}>
      <Typography component="h2" variant="h3">
        Write a review
      </Typography>
      <Snackbar
        sx={styles.snack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
      >
        <Alert severity="success" variant="filled" onClose={handleSnackClose}>
          <Typography variant="h4">
            Thank you for submitting a review
          </Typography>
        </Alert>
      </Snackbar>

      <form style={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="author"
          control={control}
          rules={{ required: "Name is required" }}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              sx={{ width: "40ch" }}
              variant="outlined"
              margin="normal"
              required
              onChange={onChange}
              value={value}
              id="author"
              label="Author's name"
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
            required: "Review cannot be empty.",
            minLength: { value: 10, message: "Review is too short" },
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
              label="Review text"
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
              label="Rating Select"
              value={rating}
              onChange={handleRatingChange}
              helperText="Don't forget your rating"
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
            color="primary"
            sx={styles.submit}
          >
            Submit
          </Button>
          <Button
            type="reset"
            variant="contained"
            color="secondary"
            sx={styles.submit}
            onClick={() => {
              reset({
                author: "",
                content: "",
              });
            }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReviewForm;
