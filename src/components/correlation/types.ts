export enum CorrelationType {
  matrix = 'Matrix view',
  list = 'List view',
}

export enum CorrelationSortType {
  lowest = 'lowest correlation value',
  highest = 'highest correlation value',
  closestToZero = 'closest to 0 correlation value',
  lowestAndHighest = 'lowest and highest correlation value',
}

export interface CorrelationValue {
  value: number;
  vertical: string;
  horizontal: string;
}

export enum Colors {
  gradientBeginColor = '#4F7E92',
  gradientMiddleColor = '#d58b8b',
  gradientEndColor = '#B76046',
}
