export const jobsListStyles = (selectedRow: number, isOpen?: boolean) => ({
  width: '100%',
  '>table>tbody>tr': {
    border: '1px solid #E2E2E2',
  },
  '>table>tbody>tr:first-of-type': {
    border: '0px',
  },
  paddingBottom: '40px',
  'tr>td:first-of-type>div': {
    color: 'gray',
  },
  'tr>td:last-of-type>div': {
    maxWidth: 'auto',
  },

  ...(isOpen && {
    zIndex: 30,
    tr: {
      backgroundColor: 'grayShade2',
    },
    'tr:first-of-type': {
      backgroundColor: 'grayShade2',
    },
    'tr:first-of-type>td:last-of-type': {
      width: '100%',
    },
    [`tr:nth-of-type(${selectedRow + 2})`]: {
      border: '2px solid #21B182',
      backgroundColor: '#FFF',
      zIndex: 35,
    },
  }),

  'tr>td': {
    px: '10px',
    minWidth: '65px',
  },
  'tr:first-of-type>td': {
    fontWeight: 'bold',
    paddingLeft: '10px',
  },
  'tr>td>div': {
    div: {
      height: '31px',
    },
  },
  'tr>td:first-of-type': {
    minWidth: '0px',
    paddingLeft: '10px',
  },
  'tr>td:nth-last-of-type(1)': {
    minWidth: '200px',
    paddingRight: '14px',
  },
  'tr>td:nth-last-of-type(3)': {
    minWidth: '125px',
  },
  'tr>td:nth-last-of-type(4)': {
    minWidth: '115px',
    position: 'relative',
  },
  'tr>td:nth-last-of-type(5)': {
    position: 'relative',
    paddingLeft: '20px',
    ':before': {
      content: '""',
      width: '1px',
      height: '32px',
      backgroundColor: 'grayShade3',
      position: 'absolute',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
    },
  },
  'tr:first-of-type>td:nth-last-of-type(5)': {
    position: 'relative',
    paddingLeft: '20px',
    ':before': {
      display: 'none',
    },
  },
  'tr:first-of-type>td:nth-last-of-type(4)': {
    paddingLeft: '20px',
    ':before': {
      content: '""',
      width: '1px',
      height: '15px',
      backgroundColor: 'grayShade2',
      position: 'absolute',
      top: '50%',
      left: 0,
      transform: 'translateY(-50%)',
    },
  },
  'tr>td:nth-of-type(4)': {
    paddingRight: '20px',
  },
  'tr>td:nth-of-type(2), tr>td:nth-of-type(1)': {
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  'tr:first-of-type>td:nth-of-type(2), tr:first-of-type>td:nth-of-type(1)': {
    cursor: 'auto',
    ':hover': {
      textDecoration: 'none',
    },
  },
  span: {
    fontWeight: 600,
    fontFamily: 'IBM Plex Mono',
  },
});
