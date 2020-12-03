const styles = (isSelected: boolean) => ({
  transition: 'all 0.2s linear',

  mb: '20px',

  color: 'primary',

  ...(isSelected && {
    boxShadow: '0px 0px 2px 2px',
    zIndex: 30,
  }),

  '&:hover': {
    boxShadow: '0px 0px 0 2px',
  },
});

export default styles;
