import { SxStyleProp } from 'rebass';

export default {
  table: {
    td: {
      px: '10px',
      whiteSpace: 'nowrap',
    },
    'td:nth-of-type(1)': {
      pl: '20px',
    },
    'td:nth-of-type(4)': {
      pr: '20px',
    },
    svg: {
      fontSize: '14px',
    },
  },
} as SxStyleProp;
