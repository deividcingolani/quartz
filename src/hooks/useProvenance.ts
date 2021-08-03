import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProvenanceState } from '../components/provenance/types';

// Types
import { Dispatch, RootState } from '../store';
import { Dataset } from '../store/models/provenance/provenance.model';

export interface UseProvenanceData {
  projectId: number;
  featureStoreId: number;
  data: Dataset | null;
}

export interface UseProvenanceOut {
  provenance: ProvenanceState;
  isLoading: boolean;
}

const useProvenance = ({
  projectId,
  featureStoreId,
  data,
}: UseProvenanceData): UseProvenanceOut => {
  const dispatch = useDispatch<Dispatch>();
  const provenance = useSelector((state: RootState) => state.provenance);
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.provenance.fetch,
  );

  /* ------------------------------------------------------------------------ */
  // TODO: (gonzalo) remove when provenance for shared fs is ready.
  const featurestore = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );
  const isOwnFS = featurestore?.featurestoreId === featureStoreId;
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!provenance && !isLoading && isOwnFS) {
      if (projectId && featureStoreId && data) {
        dispatch.provenance.fetch({
          projectId,
          featureStoreId,
          data,
        });
      }
    }
  }, [
    data,
    dispatch,
    featureStoreId,
    isLoading,
    isOwnFS,
    projectId,
    provenance,
  ]);

  return {
    provenance,
    isLoading,
  };
};

export default useProvenance;
