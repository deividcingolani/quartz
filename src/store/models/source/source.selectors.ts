import { RootState } from '../../index';
import { ISelectData } from '../../types';
import { ISource } from '../../../types/source';

export const selectSourceData = ({
  sources,
  loading,
}: RootState): ISelectData<ISource[]> => {
  return {
    data: sources,
    isLoading: loading.effects.sources.fetch,
  };
};
