import { JobFormData } from '../types';

const formatted = (data: JobFormData) => {
  const newData: any = JSON.parse(JSON.stringify(data));
  return Object.keys(newData).reduce((result, current) => {
    return {
      ...result,
      [current.replaceAll('*', '.')]: newData[current],
    };
  }, {});
};

export default formatted;
