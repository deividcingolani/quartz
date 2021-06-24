import { format } from 'date-fns';

const getAVGtime = (executions: any[]) => {
  const avg =
    executions.reduce((ac, a) => a.duration + ac, 0) / executions.length;
  return format(new Date(avg), "h'h' mm'm' ss's'");
};

export default getAVGtime;
