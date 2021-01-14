import { Box } from 'rebass';
import { Input } from '@logicalclocks/quartz';
import { useLocation } from 'react-router-dom';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
// Hooks
import useSearchData from './useSearchData';
import useOS, { OSNames } from '../../hooks/useOS';
// Components
import SearchResults from './SearchResults';
import SearchRightContent from './SearchRightContent';

const backdropStyles = {
  position: 'fixed',
  zIndex: 29,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  bg: 'rgba(39, 39, 39, 0.2)',
};

const Search: FC = () => {
  const { name } = useOS();

  const inputRef = useRef<HTMLInputElement>();
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState();

  const { data } = useSearchData();

  const location = useLocation();

  const handleFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleShortcut = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyP' && inputRef.current) {
      e.preventDefault();
      inputRef.current.focus();
    }

    if (e.key === 'Escape' && inputRef.current) {
      setOpen(false);
      inputRef.current.blur();
    }
  }, []);

  const handleChange = useCallback((e) => {
    setOpen(true);
    setSearch(e.target.value);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [handleShortcut]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isMacOS = name === OSNames.MAC;

  return (
    <>
      <Box sx={{ zIndex: 30 }} mt="5px" ml="15px">
        <Input
          mt="-5px"
          ref={inputRef}
          icon="search"
          onFocus={handleFocus}
          iconPaddingRight={isMacOS ? '60px' : '80px'}
          rightIcon={<SearchRightContent isOpen={isOpen} isMacOS={isMacOS} />}
          placeholder="Search for"
          width="474px"
          height="40px"
          onClick={() => setOpen(true)}
          onChange={handleChange}
        />

        {isOpen && (
          <Box bg="grayShade1" sx={{ position: 'absolute' }}>
            <SearchResults search={search} data={data} />
          </Box>
        )}
      </Box>

      {isOpen && <Box onClick={handleBlur} sx={backdropStyles} />}
    </>
  );
};

export default Search;
