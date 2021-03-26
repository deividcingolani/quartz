const featureListStyles = {
  table: {
    whiteSpace: 'nowrap',
    td: {
      pl: '18px',
    },
    tr: {
      ':nth-of-type(1)': {
        td: {
          px: '10px',
        },
        'td:nth-of-type(1)': {
          pl: 0,
        },
      },
    },
  },
};

export default featureListStyles;
