export default {
  container: {
    '.recharts-tooltip-wrapper': {
      visibility: 'visible',
      bottom: '-25px',
      top: 'unset !important',
      left: '10px',
      transform: 'none !important',
    },
  },
  vertical: {
    chartWrapper: {
      position: 'relative',
      '> div:first-of-type': {
        display: 'flex',
        alignItems: 'flex-end',
        pr: '3px',
        marginTop: '0px',
        marginBottom: '5px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: 'black',
      },
    },
  },
  horizontal: {
    chartWrapper: {
      overflowY: 'auto',
      position: 'relative',
      borderTopWidth: '1px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderBottomWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'grayShade3',
      '> div:first-of-type': {
        display: 'flex',
        alignItems: 'flex-end',
        pr: '3px',
        marginBottom: '15px',
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
    },
  },
  donut: {
    'div > svg > g': {
      transform: 'translateY(-65%)',
    },
    '.recharts-legend-wrapper': {
      bottom: '-13px !important',
    },
    '.recharts-legend-item-text': {
      fontFamily: 'label',
      fontWeight: 'label',
      fontSize: 'label',
    },
  },
};
