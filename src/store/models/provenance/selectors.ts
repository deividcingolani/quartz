import { RootState } from '../../index';
import { ProvenanceState } from '../../../components/provenance/types';

export type SelectData<Data> = {
  data: Data;
  isLoading: boolean;
};

export const selectProvenance = ({
  provenance,
  loading,
}: RootState): SelectData<ProvenanceState> => ({
  data: provenance,
  isLoading: loading.effects.provenance.fetch,
});
