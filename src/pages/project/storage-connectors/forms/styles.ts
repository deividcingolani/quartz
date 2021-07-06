import { SxStyleProp } from 'rebass';

// eslint-disable-next-line import/prefer-default-export
export const passwordStyles = (
  isShow: boolean,
  disabled: boolean,
): SxStyleProp => ({
  border: 'none',
  right: '7px',
  position: 'absolute',
  top: '17px',
  transform: 'translateY(-50%)',
  fontSize: '14px',

  cursor: disabled ? '' : 'pointer',

  div: {
    border: 'none',
    ': hover': {
      svg: {
        path: {
          opacity: '.7',
        },
      },
    },
    svg: {
      path: {
        // eslint-disable-next-line no-nested-ternary
        fill: disabled ? 'gray' : isShow ? '#21B182' : 'black',
      },
    },
  },
});
