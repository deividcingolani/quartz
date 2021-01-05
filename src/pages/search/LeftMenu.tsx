import { Box } from 'rebass';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Input, Label, Button } from '@logicalclocks/quartz';

export interface LeftMenuProps {
  isLoading: boolean;
}

const LeftMenu: FC<LeftMenuProps> = ({ isLoading }) => {
  const { searchText = '', id } = useParams();
  const location = useLocation();

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

  return (
    <Box p="20px" minWidth="220px">
      <Label>Free text search</Label>
      <Input
        mt="10px"
        value={search}
        variant="white"
        placeholder="search for..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onChange={({ target }) => setSearch(target.value)}
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
