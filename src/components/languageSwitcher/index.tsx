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
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Language</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={lang}
          label="Language"
          onChange={handleChange}
        >
          <MenuItem value={"en-US"}>English</MenuItem>
          <MenuItem value={"es"}>Spanish</MenuItem>
          <MenuItem value="pt">Portuguese</MenuItem>
          <MenuItem value="it">Italian</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

/**
 * https://mui.com/material-ui/react-select/
 * */
