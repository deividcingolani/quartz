import { SxStyleProp } from 'rebass';

export const progressBarStyles = (
  percent: number,
  color: string,
): SxStyleProp => ({
  bg: color,
  width: percent + '%',
  marginRight: '2px',
});
