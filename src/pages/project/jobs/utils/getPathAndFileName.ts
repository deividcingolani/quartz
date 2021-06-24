const getPathAndFileName = (appPath: string) => {
  let fileName: string | undefined = '-';
  let path = '-';
  if (appPath) {
    const splitPath: string[] = appPath.split('/');
    fileName = splitPath.pop();
    path = splitPath.slice(3).join('/');
  }

  return { fileName, path };
};

export default getPathAndFileName;
