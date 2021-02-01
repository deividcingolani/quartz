import { SxStyleProp } from 'rebass';

export default {
  table: {
    tr: {
      ':nth-of-type(1)': {
        td: {
          my: '-10px',

          ':nth-of-type(2)': {
            pl: '20px',
          },
          ':nth-of-type(3)': {
            pl: '40px',
          },
          ':nth-of-type(4)': {
            pr: '20px',
          },
        },
      },
    },
    td: {
      ':nth-of-type(1)': {
        pl: '20px',
      },
      ':nth-of-type(2)': {
        px: 0,
      },

      ':nth-of-type(4)': {
        float: 'right',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
      },

      ':nth-of-type(5)': {
        pr: '20px',
        pl: 0,

        svg: {
          fontSize: '14px',
        },
      },
    },
  },
} as SxStyleProp;
