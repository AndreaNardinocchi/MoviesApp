import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// I18next is the core of the i18n functionality while react-i18next extends and glues it to react.
i18n.use(initReactI18next).init({
  // Set the initial language to English
  lng: "en",
  // Language to fallback to if translation is missing in the selected language
  fallbackLng: "en",
  // Define namespaces to organize translations
  ns: ["myKeys"],
  // Default namespace if none is specified in the translation function
  defaultNS: "myKeys",
  // Translation resources - inline translations for English and Spanish
  resources: {
    en: {
      myKeys: {
        welcome: "Hi", // key 'welcome' in 'common' namespace for English
        all_you_ever_wanted: "All you ever wanted to know about Movies!",
        language: "Language", // key 'language' in 'common' namespace for English
        home: "Home",
        movie_lists: "Movie Lists",
        upcoming_movies: "Upcoming Movies",
        mustwatch_movies: "MustWatch Movies",
        now_playing: "Now Playing",
        favorites_movies: "Favorites Movies",
        tv_series: "TV Series",
        login: "Login",
        address: "Address",
        projects: "Projects",
        republic_of_ireland: "Republic of Ireland",
      },
    },
    es: {
      myKeys: {
        welcome: "Hola", // key 'welcome' in 'common' namespace for Spanish
        language: "Idioma", // key 'language' in 'common' namespace for Spanish
        all_you_ever_wanted:
          "¡Todo lo que siempre quisiste saber sobre películas!",
        home: "Inicio",
        movie_lists: "Listas de Películas",
        upcoming_movies: "Próximamente",
        mustwatch_movies: "Imprescindibles",
        now_playing: "En Cartelera",
        favorites_movies: "Favoritas",
        tv_series: "Series de TV",
        login: "Iniciar",
        address: "Dirección",
        projects: "Proyectos",
        republic_of_ireland: "República de Irlanda",
      },
    },

    pt: {
      myKeys: {
        welcome: "Olá",
        language: "Idioma",
        all_you_ever_wanted: "Tudo o que você sempre quis saber sobre filmes!",
        home: "Início",
        movie_lists: "Listas de Filmes",
        upcoming_movies: "Em Breve",
        mustwatch_movies: "Imperdíveis",
        now_playing: "Em Cartaz",
        favorites_movies: "Favoritos",
        tv_series: "Séries de TV",
        login: "Entrar",
        address: "Endereço",
        projects: "Projetos",
        republic_of_ireland: "República da Irlanda",
      },
    },
    it: {
      myKeys: {
        welcome: "Ciao",
        language: "Lingua",
        all_you_ever_wanted:
          "Tutto quello che hai sempre voluto sapere sui film!",
        home: "Home",
        movie_lists: "Liste di Film",
        upcoming_movies: "In Uscita",
        mustwatch_movies: "Da Vedere",
        now_playing: "Ora al Cinema",
        favorites_movies: "Preferiti",
        tv_series: "Serie TV",
        login: "Accedi",
        address: "Indirizzo",
        projects: "Progetti",
        republic_of_ireland: "Repubblica d'Irlanda",
      },
    },
  },
});

// Export the configured i18n instance for use in your React app
export default i18n;

/**
 * Several sources were consulted with https://react.i18next.com/latest/using-with-hooks being the main one
 * https://dev.to/adrai/supercharge-your-typescript-app-mastering-i18next-for-type-safe-translations-2idp
 * https://react.i18next.com/latest/using-with-hooks#configure-i18next
 * https://www.i18next.com/overview/configuration-options
 * https://react.i18next.com/latest/usetranslation-hook
 */
