import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Labeling, Text } from '@logicalclocks/quartz';
// Types
import { DataEntity } from '../../types';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';
import { SearchState } from '../../store/models/search/search.model';
// Hooks
import useNavigateRelative from '../../hooks/useNavigateRelative';
// Utils
import filterResult, { cropResult } from './utils/filterResult';
// Components
import SearchHelp from './SearchHelp';
import SearchItemCard from './SearchItemCard';
import useHistory from '../../hooks/useHistory';
import DeepSearchButtons from './DeepSearchButtons';

export enum DTO {
  'fg' = 'cachedFeaturegroupDTO',
  'td' = 'trainingDatasetDTO',
}

const maxResultsCount = 10;
const deepSearchButtonsCount = 2;

const SearchResults: FC<{ search?: string; data: SearchState }> = ({
  search = '',
  data,
}) => {
  const { history } = useHistory();
  const { id: projectId } = useParams();

  const allResults = useMemo(() => {
    return filterResult(data, search, history);
  }, [search, data, history]);

  const allItemsLength = useMemo(() => allResults.length, [allResults]);

  const result = useMemo(() => {
    return cropResult(allResults, maxResultsCount);
  }, [allResults]);

  const navigate = useNavigateRelative();

  const itemsLength = useMemo(() => result.length, [result]);

  const [activeIndex, setActive] = useState(-1);

  const handleNavigate = useCallback(
    (item: DataEntity) => {
      if (item.type === DTO.fg) {
        navigate(`/fg/${item.id}`, `p/:id/*`);
      } else if (item.type === DTO.td) {
        navigate(`/td/${item.id}`, `p/:id/*`);
      }
    },
    [navigate],
  );

  const handleOpen = useCallback(
    (index?) => {
      if (activeIndex === -1 && index === undefined) {
        return;
      }

      if (activeIndex > itemsLength - 1) {
        if (activeIndex - itemsLength === 1) {
          navigate(`/search/p/${projectId}/features/${search}`);
        } else {
          navigate(`/search/features/${search}`);
        }
        return;
      }

      let item;
      if (activeIndex >= 0 && activeIndex < itemsLength) {
        item = result[activeIndex];
      } else if (index >= 0 && index < itemsLength) {
        item = result[index];
      }

      if (item) {
        handleNavigate(item);
      }
    },
    [
      result,
      search,
      navigate,
      projectId,
      itemsLength,
      activeIndex,
      handleNavigate,
    ],
  );

  const handleClick = useCallback(
    (index: number) => () => {
      handleOpen(index);
    },
    [handleOpen],
  );

  const handleSelect = useCallback(
    (e) => {
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();

        const maxLength = itemsLength + deepSearchButtonsCount;
        if (e.key === 'ArrowDown') {
          setActive((index) =>
            index === -1 ? 0 : index > maxLength - 2 ? 0 : index + 1,
          );
        } else {
          setActive((index) =>
            index === -1
              ? maxLength - 1
              : index === 0
              ? maxLength - 1
              : index - 1,
          );
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleOpen();
      }
    },
    [itemsLength, handleOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleSelect);
    return () => {
      window.removeEventListener('keydown', handleSelect);
    };
  }, [handleSelect]);

  if (!search && !allItemsLength) {
    return null;
  }

  return (
    <>
      <Box mt="3px" bg="white" width="474px" pt="12px" pb="5px">
        <Labeling pl="12px" bold fontSize="10px" gray>
          {!search ? 'Recently open' : 'Name contains'}
        </Labeling>

        <Box mt="5px">
          {result.map((item, index) => (
            <SearchItemCard
              item={item}
              index={index}
              search={search}
              key={`item-${item.id}`}
              activeIndex={activeIndex}
              type={
                item.type === DTO.fg ? ItemDrawerTypes.fg : ItemDrawerTypes.td
              }
              handleClick={handleClick(index)}
            />
          ))}

          {maxResultsCount < allItemsLength && (
            <Flex
              sx={{
                bg: 'grayShade3',
              }}
              height="30px"
              px="12px"
              alignItems="center"
            >
              <Text>
                {allItemsLength - maxResultsCount} more feature groups /
                training datasets match
              </Text>
            </Flex>
          )}

          {!allItemsLength && (
            <Flex
              sx={{
                bg: 'grayShade3',
              }}
              height="30px"
              px="12px"
              alignItems="center"
            >
              <Text>No matches found</Text>
            </Flex>
          )}
        </Box>
      </Box>

      {!!search && (
        <DeepSearchButtons
          search={search}
          activeIndex={activeIndex - itemsLength}
        />
      )}

      <SearchHelp />
    </>
  );
};

export default SearchResults;
