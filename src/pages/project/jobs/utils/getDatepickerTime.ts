import { format, isToday } from 'date-fns';

export const getDatePickerTime = (
  time: Date,
  isFromDate = true,
  defaultDates: {
    fromDate?: Date;
    toDate?: Date;
  },
): string => {
  if (isToday(time)) {
    return 'today';
  }

  if (isFromDate && defaultDates.fromDate) {
    if (+time === +defaultDates.fromDate) {
      return format(time, 'dd MMM. y');
    }

    if (time.getHours() === 0 && time.getMinutes() === 0) {
      return format(time, 'dd MMM. y');
    }
  }

  if (defaultDates.toDate) {
    if (+time === +defaultDates.toDate) {
      return format(time, 'dd MMM. y');
    }

    if (time.getHours() === 23 && time.getMinutes() === 30) {
      return format(time, 'dd MMM. y');
    }
  }

  return format(time, 'dd MMM. y H:mm a');
};
