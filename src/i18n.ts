import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import it from './locales/it.json';
import fr from './locales/fr.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
    de: {
      translation: de,
    },
    es: {
      translation: es,
    },
    it: {
      translation: it,
    },
    fr: {
      translation: fr,
    },
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
