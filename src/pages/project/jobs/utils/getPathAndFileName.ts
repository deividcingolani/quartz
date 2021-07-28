const getPathAndFileName = (appPath: string) => {
  let fileName: string | undefined = '-';
  let path = '-';
  if (appPath) {
    const splitPath = appPath.replace('hdfs://', '').split('/');
    fileName = splitPath.pop();
    path = splitPath.join('/');
  }

  return { fileName, path };
};

export default getPathAndFileName;
