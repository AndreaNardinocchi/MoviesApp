import { useTranslation } from "react-i18next";

const ratings = () => {
  /**
   * We are using the translation hook gets the t function and i18n instance inside our functional component.
   * However, i18n is already embedded into the <LanguageSwitcher /> component
   * https://react.i18next.com/latest/usetranslation-hook
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  return [
    { value: 5, label: t("excellent") },
    { value: 4, label: t("good") },
    { value: 3, label: t("average") },
    { value: 2, label: t("poor") },
    { value: 0, label: t("terrible") },
  ];
};
export default ratings;

/**
 * useTranslation() cannot be usedoutside of a component, as it
 * breaks the Hooks rule. Hence, we needed to create a component here
 * inside the /hooks folder to properly use the useTranslations() function.
 *
 * */
