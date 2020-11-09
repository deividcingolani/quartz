import { keyframes } from '@emotion/core';

const loadingAnimation = keyframes`
  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
`;

export default {
  position: 'absolute',
  left: '50%',
  top: '50%',

  transform: 'translate(-50%, -50%)',

  svg: {
    animation: `${loadingAnimation} 1.5s ease infinite`,
    path: {
      fill: 'primary',
    },
  },
};
