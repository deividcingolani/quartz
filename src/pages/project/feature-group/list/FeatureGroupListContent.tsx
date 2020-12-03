import React, { FC } from 'react';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Components
import FilterResult from '../../../../components/filter-result/FilterResult';
import Card from './Card';
import useDrawer from '../../../../hooks/useDrawer';
import ItemDrawer from '../../../../components/drawer/ItemDrawer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export interface FeatureGroupListContentProps {
  data: FeatureGroup[];
  isLabelsLoading: boolean;
  isFiltered: boolean;
  onResetFilters: () => void;
}

const FeatureGroupListContent: FC<FeatureGroupListContentProps> = ({
  data,
  onResetFilters,
  isFiltered,
  isLabelsLoading,
}) => {
  const { isOpen, selectedId, handleSelectItem, handleClose } = useDrawer();

  const allFeatureGroups = useSelector(
    (state: RootState) => state.featureGroups,
  );

  return (
    <>
      {!!selectedId && (
        <ItemDrawer<FeatureGroup>
          data={allFeatureGroups}
          id={selectedId}
          isOpen={isOpen}
          handleToggle={handleClose}
          navigateTo={(id: number) => `/fg/${id}`}
        />
      )}
      {data.map((item) => (
        <Card
          isSelected={selectedId === item.id}
          handleToggle={handleSelectItem(item.id)}
          key={item.id}
          data={item}
          isLabelsLoading={isLabelsLoading}
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
