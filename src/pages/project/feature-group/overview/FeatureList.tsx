import { Box, Flex } from 'rebass';
import React, { ComponentType, FC, memo } from 'react';
import {
  Row,
  Card,
  Input,
  Button,
  Select,
  ToggleButton,
  Labeling,
  Value,
} from '@logicalclocks/quartz';

// Types
import { FeatureGroup } from '../../../../types/feature-group';
// Hooks
import useFeatureFilter, { KeyFilters } from '../hooks/useFeatureFilters';
import useFeatureListRowData from './useFeatureListRowData';
// Styles
import featureListStyles from './feature-lists-styles';
import icons from '../../../../sources/icons';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';

export interface FeatureListProps {
  data: FeatureGroup;
}

const FeatureList: FC<FeatureListProps> = ({ data }) => {
  const {
    dataFiltered,
    types,
    onlineTypes,
    search,
    typeFilters,
    onlineTypeFilters,
    keyFilter,
    onTypeFiltersChange,
    onOnlineTypeFiltersChange,
    onSearchChange,
    onToggleKey,
    onReset,
  } = useFeatureFilter(data.features,'',data.onlineEnabled);

  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  const [groupComponents, groupProps] = useFeatureListRowData(
    dataFiltered,
    data,
  );

  const labels: string[] = data.onlineEnabled 
            ? ["name", "offline type", "online type", 'description']
            : ["name", "type", 'description']  


  if (!data.features.length) {
    return (
      <Card
        mt="20px"
        title="Feature list"
        actions={
          data.statisticsConfig.enabled && (
            <Button
              p={0}
              intent="inline"
              href={getHref('/statistics', 'data.onlineEnabled ? "offline type" : "type"/p/:id/fg/:fgId/*')}
              onClick={() => navigate('/statistics', '/p/:id/fg/:fgId/*')}
            >
              inspect data
            </Button>
          )
        }
        contentProps={{ overflow: 'auto', pb: 0 }}
        maxHeight="400px"
      >
        <Box mt="20px" mx="-20px">
          <Flex mt="30px" mb="40px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              This feature group does contain any feature
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      mt="20px"
      title="Feature list"
      actions={
        data.statisticsConfig.enabled && (
          <Button
            p={0}
            intent="inline"
            href={getHref('/statistics', '/p/:id/fg/:fgId/*')}
            onClick={() => navigate('/statistics', '/p/:id/fg/:fgId/*')}
          >
            inspect data
          </Button>
        )
      }
      contentProps={{ overflow: 'auto', pb: 0 }}
      maxHeight="400px"
    >
      {/* Filters */}
      <Flex>
        <Input
          value={search}
          icon="search"
          placeholder="Find feature"
          onChange={onSearchChange}
        />
        <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={typeFilters}
          options={types}
          placeholder={data.onlineEnabled ? "offline type" : "type"}
          onChange={onTypeFiltersChange}
        />
        {data.onlineEnabled && <Select
          maxWidth="180px"
          width="max-content"
          ml="15px"
          isMulti
          value={onlineTypeFilters}
          options={onlineTypes}
          placeholder="online type"
          onChange={onOnlineTypeFiltersChange}
        />}
        <ToggleButton
          ml="15px"
          sx={{
            textAlign: 'center',
          }}
          height="35px"
          checked={keyFilter === KeyFilters.primary}
          onChange={onToggleKey(KeyFilters.primary)}
        >
          <Box
            p="0 !important"
            ml="-10px"
            mr="4px"
            mt="-3px"
            sx={{
              svg: {
                width: '20px',
                height: '20px',
              },
            }}
          >
            {icons.primary}
          </Box>
          Primary Keys Only
        </ToggleButton>
        <ToggleButton
          ml="15px"
          sx={{
            textAlign: 'center',
          }}
          height="35px"
          checked={keyFilter === KeyFilters.partition}
          onChange={onToggleKey(KeyFilters.partition)}
        >
          <Box
            p="0 !important"
            ml="-10px"
            mr="4px"
            mt="-3px"
            sx={{
              svg: {
                width: '20px',
                height: '20px',
              },
            }}
          >
            {icons.partition}
          </Box>
          Partition Keys Only
        </ToggleButton>
      </Flex>
      {!!dataFiltered.length ? (
        <Box mt="30px" mx="-19px" sx={featureListStyles}>
          <Row
            legend={labels}
            middleColumn={labels.indexOf('description')}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      ) : (
        <Flex mt="40px" mb="40px" flexDirection="column" alignItems="center">
          <Value fontSize="18px">No match with the filters</Value>
          <Button mt="20px" onClick={onReset}>
            Reset filters
          </Button>
        </Flex>
      )}
    </Card>
  );
};

export default memo(FeatureList);
