export const shutdownLevelToTimeAlive = (
  shutdownLevel: number | string,
): string => {
  const map = {
    6: '6h',
    12: '12h',
    nolimit: 'no limit',
  } as any;

  return map[shutdownLevel];
};

export const getJupyterUrl = (port: number, token: string): string => {
  const origin = process.env.REACT_APP_API_HOST_EXEC;
  return `${origin}/jupyter/${port}/lab?token=${token}`;
};
