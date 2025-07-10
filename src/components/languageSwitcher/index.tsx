import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import i18n from "../../i18n/i18n";

export default function LanguageSwitcher() {
  /**
   * Set initial language from i18next, default to English ("en").
   * https://www.i18next.com/overview/api#language
   */
  const [lang, setLang] = React.useState(i18n.language || "en-US");

  /**
   * Handles language selection changes in the dropdown.
   * Updates the component's state and instructs i18next to switch to the selected language.
   * i18n.changeLanguage(newLang) tells the i18n instance to use the new language,
   * triggering re-rendering of all text using the `t()` translation function.
   * https://www.i18next.com/overview/api#changelanguage
   * https://react.i18next.com/latest/usetranslation-hook#changing-language
   */
  const handleChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value;
    setLang(newLang);
    i18n.changeLanguage(newLang); // Tell i18next to change language
  };

  return (
    <Box sx={{ minWidth: 120, color: "#8E4585" }}>
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            /**
             * Sets the base text color to white
             * The '&.Mui-focused' selector targets the component when it has the 'Mui-focused' class,
             * which MUI applies automatically when the component is focused.
             * https://mui.com/customization/how-to-customize/#overriding-styles
             * https://stackoverflow.com/questions/67139471/how-can-i-change-the-focused-color-of-a-textfield?
             */
            color: "#ffffff",
            "&.Mui-focused": {
              // Keep the text color white even when the component is focused,
              color: "#ffffff",
            },
          }}
        >
          Language
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={lang}
          label="Language"
          onChange={handleChange}
          sx={{
            // https://mui.com/material-ui/api/outlined-input/#css
            // Text color
            color: "#ffffff",

            // Target the outline border of the MUI OutlinedInput component
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff",
            },

            /**
             * Focused selector border which applies when the Select is focused (clicked)
             * '&' refers to the root element, and '.Mui-focused' is a MUI-generated class
             *  https://mui.com/system/the-sx-prop/#nesting-selectors
             * */
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ffffff",
            },

            // Hover state selector which applies when the mouse is hovering over the Select
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#C06A9A",
            },
          }}
        >
          {/* 
           The language codes have been adjusted to reflect thos used by the TMDB database
           https://www.themoviedb.org/talk/5a5c4e709251413232005f25
           https://developer.themoviedb.org/docs/languages?
           https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
           */}
          <MenuItem value={"en-US"}>English</MenuItem>
          <MenuItem value={"es-ES"}>Spanish</MenuItem>
          <MenuItem value={"pt-BR"}>Portuguese</MenuItem>
          <MenuItem value={"it-IT"}>Italian</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

/**
 * https://mui.com/material-ui/react-select/
 * */
