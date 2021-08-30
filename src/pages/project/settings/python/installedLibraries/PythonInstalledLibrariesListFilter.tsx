// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ChangeEvent, FC, memo } from 'react';
// Components
import { Box, Flex } from 'rebass';
import { Input, Select, Labeling } from '@logicalclocks/quartz';

export interface PythonInstalledLibrariesListFilterProps {
  setSearch: (arg: string) => void;
  search: string;
  setFilter: (arg: string) => void;
  filter: string;
}

export enum PythonInstalledLibraryFilterValues {
  ANY = 'any',
  PIP = 'pip',
  CONDA = 'conda',
}
const PythonInstalledLibrariesListFilter: FC<PythonInstalledLibrariesListFilterProps> =
  ({ setSearch, search, filter, setFilter }) => {
    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
      const val: string = event.target.value;
      setSearch(val);
    };

    const handleFilter = (value: string[]) => {
      setFilter(value[0]);
    };

    return (
      <Flex width="100%" flexDirection="row" alignItems="center">
        <Flex flexDirection="column">
          <Labeling bold mb="8px">
            Find a library by name
          </Labeling>
          <Input
            value={search}
            icon="search"
            onChange={handleSearch}
            placeholder="library name"
          />
        </Flex>
        <Select
          maxWidth="180px"
          width="max-content"
          ml="8px"
          mt="20px"
          value={[filter]}
          options={Object.values(PythonInstalledLibraryFilterValues)}
          placeholder="manager"
          onChange={handleFilter}
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
        />
      </Flex>
    );
  };

export default memo(PythonInstalledLibrariesListFilter);
