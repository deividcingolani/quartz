import React, { FC, useRef } from 'react';
import {
  List,
  ListItem,
  useDropdown,
  useOnClickOutside,
  IconButton,
} from '@logicalclocks/quartz';
import { Box } from 'rebass';

const HelpDropdown: FC = () => {
  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);

  return (
    <Box ref={buttonRef} sx={{ position: 'relative' }}>
      <IconButton
        tooltipProps={{ disabled: true }}
        icon={['far', 'question-circle']}
        intent="ghost-white"
        tooltip="questions"
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
              window.open('https://hopsworks.readthedocs.io/', '_blank')
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
  );
};

export default HelpDropdown;
