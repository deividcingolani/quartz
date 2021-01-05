import React, { FC, useEffect, useMemo } from 'react';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';
import useDrawer from '../../../../hooks/useDrawer';
import ItemDrawer from '../../../../components/drawer/ItemDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../../../store';

export interface FeatureGroupListContentProps {
  data: FeatureGroup[];
  isFiltered: boolean;
  onResetFilters: () => void;
  hasMatchText?: boolean;
}

const FeatureGroupListContent: FC<FeatureGroupListContentProps> = ({
  data,
  onResetFilters,
  isFiltered,
  hasMatchText,
}) => {
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
  }, [selectedId, data, hasMatchText, dispatch]);

  const projectId = useMemo(() => {
    const fg = data.find(({ id }) => id === selectedId);
    if (fg) {
      return fg.parentProjectId;
    }
  }, [selectedId, data]);

  const allFeatureGroups = useSelector(
    (state: RootState) => state.featureGroups,
  );

  return (
    <>
      {!!selectedId && (
        <ItemDrawer<FeatureGroup>
          data={allFeatureGroups}
          projectId={projectId}
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
