import { useEffect, useState } from 'react';
import { useAppStore } from '../state/store';
import { I18nService, Translations } from '../services/i18n.service';

export function useTranslation() {
  const settings = useAppStore((state) => state.settings);
  const [translations, setTranslations] = useState<Translations>(I18nService.getTranslations());

  useEffect(() => {
    I18nService.setLocale(settings.locale);
    setTranslations(I18nService.getTranslations());
  }, [settings.locale]);

  const t = (key: string): string => {
    return I18nService.t(key);
  };

  const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    return I18nService.formatDate(date, options);
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return I18nService.formatNumber(number, options);
  };

  return {
    t,
    translations,
    formatDate,
    formatNumber,
    locale: settings.locale,
  };
}