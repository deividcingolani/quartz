import { SxStyleProp } from 'rebass';

const progressBarStyles = (percent: number, color: string): SxStyleProp => ({
  bg: color,
  width: `${percent}%`,
  marginRight: '2px',
});

export default progressBarStyles;
