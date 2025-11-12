import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uz from "./locales/uz.json"
import en from "./locales/en.json"

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    en: { translation: en },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
