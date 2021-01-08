const provenanceListStyles = {
  table: {
    tableLayout: 'fixed',
  },
  td: {
    whiteSpace: 'nowrap',
    textAlign: 'left',
    width: '100px',
    overflow: 'hidden',
  },
  'td:nth-of-type(1)': {
    pl: '20px',
  },
  'td:nth-of-type(4)': {
    width: 'auto',
  },
  'td:nth-of-type(5)': {
    width: '62px',
    svg: {
      fontSize: '12px',
    },
  },

  'tr:last-of-type': {
    border: 'none',
  },
};

export default provenanceListStyles;
