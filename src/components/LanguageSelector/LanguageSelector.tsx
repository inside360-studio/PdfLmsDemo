import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = {
  en: { name: 'English' },
  de: { name: 'Deutsch' },
  es: { name: 'Español' },
  fr: { name: 'Français' },
  it: { name: 'Italiano' },
} as const;

const LanguageSelector: FC = () => {
  const { t, i18n } = useTranslation();
  const languages = Object.keys(i18n.options.resources || {}).sort();

  const getShortLangCode = (fullCode: string) => fullCode.split('-')[0];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      localStorage.setItem('i18nextLng', lang);
    });
  };

  return (
    <div className="relative flex items-center space-x-2">
      <label htmlFor="language" className="text-sm font-medium">
        {t('language')}:
      </label>
      <div className="flex items-center relative">
        <select
          id="language"
          value={getShortLangCode(i18n.language)}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-white text-gray-900 font-medium rounded-md px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 border border-blue-100 appearance-none w-[108px] pr-8"
        >
          {languages.map((lang) => {
            const language = LANGUAGES[lang as keyof typeof LANGUAGES];
            return (
              <option key={lang} value={lang}>
                {language.name}
              </option>
            );
          })}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
