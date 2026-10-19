import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const dateUtils = {
  formatDate: (from, formatFrom, formatTo) => {
    if (!formatFrom) formatFrom = 'YYYY-MM-DD';
    if (!formatTo) formatTo = 'dddd Do [of] MMMM YYYY';
    if (from) {
      const parsedDate = dayjs(from, formatFrom);
      return parsedDate.format(formatTo);
    }
    return '';
  },
};
