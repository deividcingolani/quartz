// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useRef } from 'react';
import {
  List,
  Tooltip,
  ListItem,
  useDropdown,
  useOnClickOutside,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import icons from '../../../sources/icons';

const HelpDropdown: FC = () => {
  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);

  return (
    <Flex>
      <Box
        width="1px"
        height="32px"
        backgroundColor="grayShade3"
        sx={{
          position: 'relative',
          left: '-6px',
        }}
      />
      <Box ref={buttonRef} sx={{ position: 'relative', left: '-4px' }}>
        <Tooltip mainText="Help">
          <Box
            sx={{
              cursor: 'pointer',
            }}
            ml="3px"
            mt="5px"
            onClick={() => handleToggle()}
          >
            {icons.interrogation}
          </Box>
        </Tooltip>
        {isOpen && (
          <List style={{ position: 'absolute', right: '0' }}>
            <ListItem
              onClick={() =>
                window.open('https://community.hopsworks.ai/', '_blank')
              }
            >
              Community
            </ListItem>
            <ListItem
              onClick={() =>
                window.open('https://docs.hopsworks.ai/', '_blank')
              }
            >
              Documentation
            </ListItem>
            <ListItem
              onClick={() =>
                window.open('https://forms.gle/ucrT5Y6fsFUooiVf7', '_blank')
              }
            >
              Send a feedback
            </ListItem>
          </List>
        )}
      </Box>
    </Flex>
  );
};

export default HelpDropdown;
