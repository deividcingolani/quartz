const styles = (isShow: boolean, disabled: boolean) => ({
  border: 'none',
  right: '5px',
  position: 'absolute',
  top: '16px',
  transform: 'translateY(-50%)',
  fontSize: '14px',

  cursor: 'pointer',

  button: {
    ': hover': {
      backgroundColor: '#E2E2E2',
    },
    height: '25px',
    border: 'none',
    backgroundColor: '#f5f5f5',

    svg: {
      path: {
        fill: disabled ? 'gray' : isShow ? '#21B182' : 'black',
      },
    },
  },
});

export default styles;
