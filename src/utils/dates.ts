import { format, parseISO, differenceInDays, addDays, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatString: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: fr });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const calculateAge = (birthDate: string): number => {
  return differenceInDays(new Date(), parseISO(birthDate));
};

export const calculateAgeText = (birthDate: string): string => {
  const days = calculateAge(birthDate);
  if (days < 30) {
    return `${days} jour${days > 1 ? 's' : ''}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} mois`;
  } else {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const remainingMonths = Math.floor(remainingDays / 30);
    return `${years} an${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `${remainingMonths} mois` : ''}`.trim();
  }
};

export const addDaysToDate = (date: string, days: number): string => {
  return addDays(parseISO(date), days).toISOString().split('T')[0];
};

export const isDateAfter = (date1: string, date2: string): boolean => {
  return isAfter(parseISO(date1), parseISO(date2));
};

export const isDateBefore = (date1: string, date2: string): boolean => {
  return isBefore(parseISO(date1), parseISO(date2));
};

export const isWithdrawalActive = (withdrawalUntil?: string): boolean => {
  if (!withdrawalUntil) return false;
  return isAfter(parseISO(withdrawalUntil), new Date());
};

export const getWithdrawalDaysRemaining = (withdrawalUntil?: string): number => {
  if (!withdrawalUntil) return 0;
  const days = differenceInDays(parseISO(withdrawalUntil), new Date());
  return Math.max(0, days);
};

export const calculateEstimatedWeaningDate = (kindlingDate: string): string => {
  return addDaysToDate(kindlingDate, 7 * 6); // Standard weaning period
};