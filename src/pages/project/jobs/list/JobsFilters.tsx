// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Input, Select, ToggleButton, Tooltip } from '@logicalclocks/quartz';
import icons from '../../../../sources/icons';
import { JobType } from '../../../../types/jobs';
import { JobListSortType } from '../types';

export enum KeyFilters {
  null,
  'currently running',
}

export interface JobsListContentProps {
  handleRefresh: () => void;
  onChangeSort: any;
  onSearchChange: any;
  sortOptions: JobListSortType[];
  sortKey: JobListSortType[];
  search?: string;
  typeFilters: string[];
  onTypeFiltersChange: any;
  jobType: string[];
  onToggleKey: (key: KeyFilters) => () => void;
  keyFilter: KeyFilters;
}

const JobsFilters: FC<JobsListContentProps> = ({
  handleRefresh,
  sortOptions,
  onChangeSort,
  sortKey,
  search,
  jobType,
  onTypeFiltersChange,
  typeFilters,
  onSearchChange,
  onToggleKey,
  keyFilter = KeyFilters.null,
}) => {
  return (
    <Flex width="100%" height="100%" flexDirection="column" alignItems="center">
      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Flex>
          <Input
            variant="white"
            value={search}
            icon="search"
            placeholder="Find a job by name..."
            onChange={onSearchChange}
          />
          <Select
            maxWidth="180px"
            width="max-content"
            ml="15px"
            variant="white"
            isMulti
            value={
              typeFilters.length
                ? typeFilters.filter((keyword) => keyword !== 'any')
                : ['any']
            }
            options={jobType.map((el) => JobType[el as keyof typeof JobType])}
            placeholder="type"
            onChange={onTypeFiltersChange}
            noDataMessage="type all"
          />
          <Box
            sx={{
              label: {
                div: {
                  backgroundColor: '#ffffff',
                },
                'div:hover': {
                  div: {
                    backgroundColor: '#f5f5f5',
                    borderColor: 'transparent',
                  },
                },
              },
            }}
          >
            <ToggleButton
              ml="15px"
              sx={{
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}
              height="35px"
              checked={keyFilter === KeyFilters['currently running']}
              onChange={onToggleKey(KeyFilters['currently running'])}
            >
              currently running
            </ToggleButton>
          </Box>
        </Flex>
        <Flex>
          <Tooltip mainText="Refresh">
            <Flex
              onClick={handleRefresh}
              backgroundColor="#FFFFFF"
              justifyContent="center"
              alignItems="center"
              width="34px"
              height="32px"
              sx={{
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'grayShade1',
                cursor: 'pointer',
                transition: 'all .25s ease',
                marginRight: '20px',
                ':hover': {
                  borderColor: 'black',
                },
              }}
            >
              {icons.refresh}
            </Flex>
          </Tooltip>
          <Select
            variant="white"
            value={sortKey}
            options={sortOptions}
            placeholder="sort by"
            onChange={onChangeSort}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default JobsFilters;
