import { FrameworkType } from '../../../../types/jobs';
import { UploadFiles } from '../../../../components/file-explorer/types';

export const filterFields = (jobsConfig: {
  [key: string]: any;
}): { [key: string]: string } => {
  const filteredJobsConfig = { ...jobsConfig };
  if (jobsConfig.type === FrameworkType.SPARK) {
    delete filteredJobsConfig['resourceConfig.cores'];
    delete filteredJobsConfig['resourceConfig.memory'];
  } else if (jobsConfig.type === FrameworkType.PYTHON) {
    delete filteredJobsConfig.spark;
    delete filteredJobsConfig.amVCores;
    delete filteredJobsConfig.amMemory;
  }
  return filteredJobsConfig;
};

const getAdditionalPathList = (additional: UploadFiles[] | null): string[] => {
  if (additional && additional.length > 0) {
    return additional.map((el: any) =>
      el.path.startsWith('hdfs://') ? el.path : `hdfs://${el.path}`,
    );
  }
  return [''];
};

export const addDependencies = (
  type: FrameworkType,
  additionalArchives: UploadFiles[] | null,
  additionalJars: UploadFiles[] | null,
  additionalPython: UploadFiles[] | null,
  additionalFiles: UploadFiles[] | null,
): { [key: string]: string } => {
  if (type === FrameworkType.SPARK) {
    return {
      'spark.yarn.dist.pyFiles': additionalPython
        ? getAdditionalPathList(additionalPython).join(',')
        : '',
      'spark.yarn.dist.archives': additionalArchives
        ? getAdditionalPathList(additionalArchives).join(',')
        : '',
      'spark.yarn.dist.jars': additionalJars
        ? getAdditionalPathList(additionalJars).join(',')
        : '',
      'spark.yarn.dist.files': additionalFiles
        ? getAdditionalPathList(additionalFiles).join(',')
        : '',
    };
  }
  if (type === FrameworkType.PYTHON) {
    return {
      files: additionalFiles
        ? getAdditionalPathList(additionalFiles).join(',')
        : '',
    };
  }

  return {};
};

export const flatData = (
  data: { [key: string]: any },
  parentKey: string,
): { [key: string]: string } => {
  if (data.type === FrameworkType.PYTHON) {
    // Python doesn't need to be flattened
    return data;
  }

  let results: { [key: string]: string } = {};

  Object.keys(data).forEach((key) => {
    if (typeof data[key] === 'object') {
      results = {
        ...results,
        ...flatData(data[key], `${parentKey}${key}.`),
      };
    } else {
      results[`${parentKey}${key}`] = data[key];
    }
  });

  return results;
};

export const addMainClass = (
  type: FrameworkType,
  mainClass: string,
): string => {
  if (
    type === FrameworkType.SPARK &&
    (mainClass === '' || mainClass === undefined)
  ) {
    return 'org.apache.spark.deploy.PythonRunner';
  }

  return mainClass;
};
