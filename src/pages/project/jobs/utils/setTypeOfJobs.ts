import { FrameworkType } from '../../../../types/jobs';
import { FrameworkTypeUI } from '../types';

export const setFrameworkType = (type: string) => {
  switch (type) {
    case 'SPARK': {
      return FrameworkType.SPARK;
    }
    case 'PYTHON': {
      return FrameworkType.PYTHON;
    }
    default: {
      return FrameworkType.SPARK;
    }
  }
};

export const setFrameworkUIType = (type: FrameworkType) => {
  switch (type) {
    case FrameworkType.SPARK: {
      return FrameworkTypeUI.SPARK;
    }
    case FrameworkType.PYTHON: {
      return FrameworkTypeUI.PYTHON;
    }
    default: {
      return FrameworkTypeUI.SPARK;
    }
  }
};
