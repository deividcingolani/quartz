// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Input } from '@logicalclocks/quartz';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import icons from '../../sources/icons';
import useDebounce from '../../hooks/useDebounce';

const DeepSearch: FC<{
  width?: string;
  deepSearchButtons?: boolean;
}> = ({ width }) => {
  const location = useLocation();
  const initialSearch = location.pathname
    .split('/')
    .filter((x) => x)
    .reverse()[0];

  const inputRef = useRef<HTMLInputElement>();
  const [search, setSearch] = useState(initialSearch);

  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 500);

  const handleSearch = useCallback(() => {
    const matchAll = '?match=name&match=description&match=author&match=tags';
    const hasMatch = location.search.includes('match');
    const match = hasMatch ? location.search : matchAll;
    const prevPath = location.pathname.slice(
      0,
      location.pathname.lastIndexOf('/'),
    );
    navigate(`${prevPath}/${search}${match}`);
  }, [location.pathname, location.search, navigate, search]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <>
      <Box sx={{ zIndex: 30 }} mt="5px" ml="10px" width={width || '474px'}>
        <Flex>
          <Box
            mr="-30px"
            alignSelf="center"
            sx={{
              zIndex: 1,
              svg: {
                transform: 'scale(.5)',
                path: {
                  fill: '#A0A0A0',
                },
              },
            }}
          >
            {icons.glass}
          </Box>
          <Input
            mt="-4px"
            value={search}
            paddingLeft="30px"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Search for"
            width={width || '474px'}
            height={32}
            onChange={handleChange}
          />
        </Flex>
      </Box>
    </>
  );
};

export default DeepSearch;
