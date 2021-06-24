import { RuleTypes } from '../types';

const setTypeOfJob = (type: string): RuleTypes => {
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
    default:
      return RuleTypes.SPARK;
  }
};

export default setTypeOfJob;
