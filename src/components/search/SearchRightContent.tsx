// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Badge, Labeling } from '@logicalclocks/quartz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = {
  right: '10px',
  position: 'absolute',
  top: '15px',
  transform: 'translateY(-50%)',
  path: {
    fill: 'gray',
  },
  fontSize: '14px',
};

export interface SearchRightContentProps {
  isOpen: boolean;
  isMacOS: boolean;
}

const SearchRightContent: FC<SearchRightContentProps> = ({
  isOpen,
  isMacOS,
}) => {
  if (isOpen) {
    return (
      <Flex sx={styles}>
        <Labeling mt="-2px" gray>
          esc to close
        </Labeling>
      </Flex>
    );
  }

  return (
    <Flex sx={styles}>
      {isMacOS ? (
        <Labeling mr="5px" fontSize="16px" display="initial" gray>
          ⌘
        </Labeling>
      ) : (
        <Badge mt="-3px" mr="5px" variant="bold" value="Ctrl" />
      )}

      <Box mr="7px" display="initial" fontSize="10px">
        <FontAwesomeIcon icon="plus" />
      </Box>
      <Labeling fontSize="16px" display="initial" gray>
        P
      </Labeling>
    </Flex>
  );
};

export default SearchRightContent;
