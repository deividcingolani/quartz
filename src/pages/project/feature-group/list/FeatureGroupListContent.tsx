// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';

// Types
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';
import useDrawer from '../../../../hooks/useDrawer';
import ItemDrawer from '../../../../components/drawer/ItemDrawer';
import { Dispatch, RootState } from '../../../../store';

export interface FeatureGroupListContentProps {
  data: FeatureGroup[];
  isFiltered: boolean;
  onResetFilters: () => void;
  hasMatchText?: boolean;
  loading?: boolean;
}

const FeatureGroupListContent: FC<FeatureGroupListContentProps> = ({
  data,
  onResetFilters,
  isFiltered,
  hasMatchText,
  loading,
}) => {
  const { id } = useParams();

  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const fg = data.find(({ id }) => id === selectedId);

    if (fg && selectedId && hasMatchText) {
      dispatch.featureGroups.fetch({
        projectId: fg.parentProjectId,
        featureStoreId: fg.featurestoreId,
      });
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [selectedId, hasMatchText, dispatch]);

  const projectId = useMemo(() => {
    const fg = data.find(({ id }) => id === selectedId);

    if (fg) {
      return fg.parentProjectId;
    }
    return undefined;
  }, [selectedId, data]);

  const allFeatureGroups = useSelector(
    (state: RootState) => state.featureGroups,
  );

  return (
    <>
      {!!selectedId && (
        <ItemDrawer<FeatureGroup>
          data={allFeatureGroups}
          projectId={projectId || +id}
          isSearch={hasMatchText}
          id={selectedId}
          isOpen={isOpen}
          handleToggle={handleClose}
          navigateTo={(id: number) => `/fg/${id}`}
        />
      )}
      {data.map((item) => (
        <Card
          hasMatchText={hasMatchText}
          isSelected={selectedId === item.id}
          handleToggle={handleSelectItem(item.id)}
          key={item.id}
          data={item}
          loading={loading}
        />
      ))}
      {isFiltered && (
        <FilterResult
          subject="feature groups"
          result={data.length}
          onReset={onResetFilters}
        />
      )}
    </>
  );
};

export default FeatureGroupListContent;
