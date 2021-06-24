const uppercaseFirst = (value?: string): string =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';

export default uppercaseFirst;
