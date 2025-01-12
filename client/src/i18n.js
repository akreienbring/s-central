/*
  Author: André Kreienbring
  Initialises i18next.
  Exports an array with the supported languages and tries to 
  detect the preferred language of the user.
*/
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJSON from './locale/en.json';
import deJSON from './locale/de.json';
import esJSON from './locale/es.json';

export const languages = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'de',
    label: 'German',
  },
  {
    value: 'es',
    label: 'Spanish',
  },
];

/*
  Order of finding the prefered language:
    1. Language that was selected by the user.
    2. The preferred browser language (used if supported)
    3. Fallback to english
  For testing the 'i18nLanguage' key must be removed from local storage.
*/
const getDefaultLanguage = () => {
  // localStorage.removeItem('i18nLanguage'); // enable for testing
  const selectedLang = localStorage.getItem('i18nLanguage');
  if (selectedLang !== null) {
    console.log(`Using last selected language ${selectedLang}`);
    return selectedLang;
  }

  if (typeof navigator.language !== 'undefined') {
    const browserLang = navigator.language.substring(0, 2);
    if (typeof languages.find((language) => language.value === browserLang) !== 'undefined') {
      console.log(`Using browser language ${browserLang}`);
      return navigator.language.substring(0, 2);
    }
  }
  console.log(`Using browser language en`);
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    de: { ...deJSON },
    es: { ...esJSON },
  },
  lng: getDefaultLanguage(), // Set the initial language of the App
});
