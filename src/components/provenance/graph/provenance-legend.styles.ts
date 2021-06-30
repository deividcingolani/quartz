import { SxStyleProp } from 'rebass';
import { EventTarget } from '../types';

export default (color: string, type: EventTarget): SxStyleProp => {
  const node = type === EventTarget.node;
  return {
    bg: 'transparent',
    width: '10px',
    height: node ? '10px' : '2px',
    border: node ? '2px solid' : '1px solid',
    borderColor: color,
    borderRadius: node ? '50%' : '0px',
  };
};
