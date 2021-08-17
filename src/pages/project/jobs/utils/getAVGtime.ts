import { JobExecutionData } from '../../../../types/jobs';

const getAVGtime = (executions: JobExecutionData[]): string => {
  const sum = executions.reduce((ac, a) => a.duration + ac, 0);
  const avg = sum / executions.length;

  const seconds = Math.floor((avg / 1000) % 60);
  const minutes = Math.floor((avg / (1000 * 60)) % 60);
  const hours = Math.floor((avg / (1000 * 60 * 60)) % 24);

  const hours2Digits = hours < 10 ? `0${hours}` : hours;
  const minutes2Digits = minutes < 10 ? `0${minutes}` : minutes;
  const seconds2Digits = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours2Digits}h ${minutes2Digits}m ${seconds2Digits}s`;
};

export default getAVGtime;
