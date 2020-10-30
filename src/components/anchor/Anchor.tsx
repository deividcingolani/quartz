import { Box } from 'rebass';
import { useLocation } from 'react-router-dom';
import React, { FC, useCallback, useEffect, useRef } from 'react';

import useAnchor from './useAnchor';

export interface AnchorProps {
  anchor: string;
  groupName: string;
  children: React.ReactElement;
}

const styles = {
  textDecoration: 'none',
};

const Anchor: FC<AnchorProps> = ({ anchor, children, groupName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActive } = useAnchor(groupName);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    const element = document.querySelector('#content');

    const position = containerRef.current?.getBoundingClientRect();

    if (
      element &&
      position &&
      position.top > 0 &&
      position.bottom > 0 &&
      !(position.top < element?.scrollTop) &&
      !(position.top > element?.scrollTop + 100)
    ) {
      setActive(anchor);
    }
  }, [anchor, setActive]);

  useEffect(() => {
    const element = document.querySelector('#content');

    if (element) {
      element.addEventListener('scroll', handleScroll);

      return (): void => {
        element.addEventListener('scroll', handleScroll);
      };
    }

    return undefined;
  }, [handleScroll]);

  useEffect(() => {
    if (location.hash.includes(anchor)) {
      setActive(anchor);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={styles} ref={containerRef} id={anchor}>
      {children}
    </Box>
  );
};

export default Anchor;
