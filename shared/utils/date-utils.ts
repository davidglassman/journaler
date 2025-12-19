export const convertDateToFile = (date: Date): string | null => {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}.md`;
};

export const getPreviousDate = (date: Date): Date | null => {
  if (!date) {
    return null;
  }

  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);

  return previousDay;
};

export const getNextDate = (date: Date): Date | null => {
  if (!date) {
    return null;
  }

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  return nextDay;
};

export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  const targetDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate > today;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  const targetDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() === today.getTime();
};
