export default {
  div: {
    minWidth: 'initial',
    border: 'none',
  },
  table: {
    minWidth: 'initial',
    whiteSpace: 'nowrap',

    tbody: {
      tr: {
        'td:nth-of-type(1)': {
          width: '180px',
        },
        'td:nth-of-type(2)': {
          width: '80px',
        },
      },
    },
  },
};
