export const getPathAndFileName = (appPath: string) => {
  let fileName: string | undefined = '-';
  let path: string = '-';
  if (!!appPath) {
    const splitPath: string[] = appPath.split('/');
    fileName = splitPath.pop();
    path = splitPath.slice(3).join('/');
  }

  return { fileName, path };
};
