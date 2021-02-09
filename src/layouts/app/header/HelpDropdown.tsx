import React, { FC, useRef } from 'react';
import {
  List,
  ListItem,
  useDropdown,
  useOnClickOutside,
  IconButton,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';

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
        <IconButton
          icon={['far', 'question-circle']}
          intent="ghost-white"
          tooltip="Help"
          onClick={() => handleToggle()}
        />
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
