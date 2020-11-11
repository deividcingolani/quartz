const pipe = <R, T extends any[] = any>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (acc, curr) => (v: R) => acc(curr(v)),
    (v) => v,
  );

  return (...args: T) => piped(fn1(...args));
};

export default pipe;
