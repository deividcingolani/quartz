import { SxStyleProp } from 'rebass';

export default {
  table: {
    fontSize: 'normal',
    tr: {
      'td:nth-of-type(1)': {
        width: '100%',
      },
      'td:not(:nth-of-type(1))': {
        whiteSpace: 'nowrap',
      },
    },
  },
} as SxStyleProp;
