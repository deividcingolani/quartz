import { useCallback, useMemo, useState } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { permissionsToLabelMap } from '../pages/project/settings/multistore/utils';
import { SharedDataset } from '../store/models/projects/multistore.model';
import useLazyMultiStore from './useLazyMultiStore';
import useNavigateRelative from './useNavigateRelative';

export interface UseLazyMultiStoreSelectOut {
  selectFSValue: string[];
  selectFSOptions: string[];
  handleFSSelectionChange: ([value]: any) => void;
  data: any;
  invalidFS: boolean;
  isLoading: boolean;
  hasSharedFS: boolean;
}

const useMultiStoreSelect = <T>(
  hook: (projectId: number, featureStoreId: number) => T,
  sharedFrom: SharedDataset[],
): UseLazyMultiStoreSelectOut => {
  const { fsId } = useParams();
  const location = useLocation();
  const navigate = useNavigateRelative();
  const [selectedFs, setSelectedFs] = useState(`${fsId}`);
  const datasetByFS = useLazyMultiStore<T>(hook);

  const { data, isLoading, invalidFS } = datasetByFS[+selectedFs].get() as any;

  const buildPath = useCallback(
    (featurestoreId?: number): string => {
      if (!featurestoreId) return '';
      const match = matchPath(`/p/:id/fs/:fsId/*`, location.pathname);
      if (match) {
        const newPath = match.path
          .replace('*', '')
          .replace(':id', match.params.id)
          .replace(':fsId', String(featurestoreId))
          .concat(match.params['*']);
        return newPath;
      }
      return '';
    },
    [location.pathname],
  );

  const acceptedSharedFrom = useMemo(() => {
    return sharedFrom.filter((ds) => ds.accepted);
  }, [sharedFrom]);

  const selectOpts = useMemo(() => {
    const options = Object.values(datasetByFS).map((fs) => {
      const permission = acceptedSharedFrom.find(
        (x) => x.projectName === fs.projectName,
      )?.permission;
      return {
        label: `${fs.projectName} (${
          permission ? (permissionsToLabelMap as any)[permission] : 'current'
        })`,
        key: fs.featureStoreId,
      };
    });
    return options;
  }, [datasetByFS, acceptedSharedFrom]);

  const selectFSValue = useMemo(() => {
    const selected = selectOpts.find((x) => x.key === +selectedFs);
    return [selected?.label || ''];
  }, [selectOpts, selectedFs]);

  const selectFSOptions = useMemo(() => {
    return selectOpts.map((x) => x.label);
  }, [selectOpts]);

  const handleFSSelectionChange = useCallback(
    ([value]) => {
      const pId = selectOpts.find((opt) => opt.label === value)?.key;
      setSelectedFs(`${pId}`);
      const newPath = buildPath(pId);
      navigate(newPath);
    },
    [buildPath, navigate, selectOpts],
  );

  return {
    selectFSValue,
    selectFSOptions,
    handleFSSelectionChange,
    data,
    isLoading,
    invalidFS,
    hasSharedFS: acceptedSharedFrom.length > 0,
  };
};

export default useMultiStoreSelect;
