import { Box } from 'rebass';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Input, Label, Button } from '@logicalclocks/quartz';
import useTitle from '../../hooks/useTitle';
import titles from '../../sources/titles';
import useDebounce from '../../hooks/useDebounce';

export interface LeftMenuProps {
  isLoading: boolean;
}

const LeftMenu: FC<LeftMenuProps> = ({ isLoading }) => {
  const { searchText = '', id } = useParams();
  const location = useLocation();

  useTitle(id ? titles.searchWithinProject : titles.searchAcrossProject);

  const [search, setSearch] = useState(searchText);

  const navigate = useNavigate();

  useEffect(() => {
    setSearch(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSearch = useCallback(() => {
    const prevPath = location.pathname.slice(
      0,
      location.pathname.lastIndexOf('/'),
    );

    navigate(`${prevPath}/${search}`);
  }, [search, location.pathname, navigate]);

  const debouncedRange = useDebounce(search, 500);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRange]);

  return (
    <Box p="20px" minWidth="220px">
      <Label>Free text search</Label>
      <Input
        mt="10px"
        value={search}
        variant="white"
        placeholder="search for..."
        onKeyDown={(e: any) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onChange={({ target }: any) => setSearch(target.value)}
      />
      <Button
        mt="20px"
        onClick={handleSearch}
        disabled={!search.trim() || isLoading}
      >
        Update results
      </Button>
    </Box>
  );
};

export default LeftMenu;
