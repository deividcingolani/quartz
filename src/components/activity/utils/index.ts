import { ActivityItemData } from '../../../types/feature-group';

const maxOpacity = 1;
const minOpacity = 0.1;

const minDays = 1;
const maxDays = 30;

const oneDayInMilliseconds = 1000 * 60 * 60 * 24;

export const getRowsCount = (count: number): string | number => {
  return count > 1000 ? `${Math.round(count / 1000)}k` : count;
};

export const getTimeLineOpacity = (
  firstDate: number,
  secondDate: number,
): number => {
  const distance = firstDate - secondDate;
  const days = distance / oneDayInMilliseconds;

  if (days >= maxDays) {
    return minOpacity;
  }
  if (days <= minDays) {
    return maxOpacity;
  }

  return (
    minOpacity +
    (maxDays - days) * ((maxOpacity - minOpacity) / (maxDays - minDays))
  );
};

export const getStatusCount = (
  statusName: string,
  activity: ActivityItemData,
) =>
  activity.validations?.expectationResults.reduce(
    (acc, { status }) => (status === statusName ? acc + 1 : acc),
    0,
  );

export const getStatusCountForActivity = (
  statusName: string,
  activity: ActivityItemData,
) =>
  activity.validations?.expectationResults?.reduce(
    (acc, { results }) =>
      acc +
      results?.reduce(
        (nestAcc, { status }) =>
          status === statusName ? nestAcc + 1 : nestAcc,
        0,
      ),
    0,
  );
