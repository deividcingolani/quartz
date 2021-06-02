import { RuleTypes } from '../types';

export const setTypeOfJob = (type: string) => {
  switch (type) {
    case 'SPARK': {
      return RuleTypes.SPARK;
    }
    case 'PYSPARK': {
      return RuleTypes.PYSPARK;
    }
    case 'FLINK': {
      return RuleTypes.FLINK;
    }
  }
};
