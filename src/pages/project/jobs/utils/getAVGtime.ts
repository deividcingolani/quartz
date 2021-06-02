import { format } from 'date-fns';

export const getAVGtime = (executions: any[]) => {
  let avg =
    executions.reduce((ac, a) => a.duration + ac, 0) / executions.length;
  return format(new Date(avg), "h'h' mm'm' ss's'");
};
