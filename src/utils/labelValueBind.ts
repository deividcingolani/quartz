export interface LabelValueBind<T> {
  getByKey: (key: keyof T) => T[keyof T];
  getByValue: (value: string) => keyof T;
  labels: T[keyof T][];
}

const labelValueMap = <T>(map: T): LabelValueBind<T> => {
  const reverseMap = Object.entries(map).reduce<{ [key: string]: keyof T }>(
    (acc, [key, value]) => ({ ...acc, [value]: key }),
    {},
  );

  return {
    getByKey: (key) => map[key],
    getByValue: (value) => reverseMap[value],
    labels: Object.values(map),
  };
};

export default labelValueMap;
