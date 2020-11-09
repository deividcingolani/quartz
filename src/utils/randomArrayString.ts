const randomArrayString = (length: number): string[] =>
  new Array(length).fill(null).map(() => Math.random().toString(32));

export default randomArrayString;
