const durationLocaleMap: { [key: string]: string } = {
  xSeconds: '{{count}}s',
  xMinutes: '{{count}}m',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
};

const executionDurationLocale = {
  formatDistance: (token: string, count: string) =>
    durationLocaleMap[token].replace('{{count}}', count),
};

export { executionDurationLocale as default };
