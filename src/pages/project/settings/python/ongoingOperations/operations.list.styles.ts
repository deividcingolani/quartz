import { SxStyleProp } from 'rebass';

export default {
  table: {
    fontSize: 'normal',
    tr: {
      'td:nth-of-type(4)': {
        width: '100%',
        justifyContent: 'flex-end',
      },
      'td:not(:nth-of-type(4))': {
        whiteSpace: 'nowrap',
      },
    },
  },
} as SxStyleProp;
