import { Box } from 'rebass';
import { useLocation } from 'react-router-dom';
import React, { FC, useCallback, useContext, useEffect, useRef } from 'react';

import useAnchor from './useAnchor';
import { ContentContext } from '../../layouts/app/AppLayout';

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

  const timeout = useRef<number | null>(null);

  const { current: content } = useContext(ContentContext);

  const handleScroll = useCallback(() => {
    const position = containerRef.current?.getBoundingClientRect();

    if (
      content &&
      position &&
      position.top > 0 &&
      position.bottom > 0 &&
      !(position.top < content?.scrollTop) &&
      !(position.top > content?.scrollTop + 100)
    ) {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }

      setTimeout(() => setActive(anchor), 100);
    }
  }, [anchor, setActive, content]);

  useEffect(() => {
    if (content) {
      content.addEventListener('scroll', handleScroll);

      return () => {
        content.addEventListener('scroll', handleScroll);
      };
    }

    return undefined;
  }, [handleScroll, content]);

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
