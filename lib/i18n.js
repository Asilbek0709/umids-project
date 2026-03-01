import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import uz from '../locales/uz/uz.json'
import ru from "../locales/ru/ru.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
    },
    lng: typeof window !== 'undefined'
      ? (localStorage.getItem('lang') || 'uz')
      : 'uz',
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n