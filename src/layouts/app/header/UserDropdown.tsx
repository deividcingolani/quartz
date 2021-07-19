// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useRef } from 'react';
import {
  List,
  ListItem,
  useDropdown,
  useOnClickOutside,
} from '@logicalclocks/quartz';
import { useNavigate } from 'react-router-dom';
import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';

// Services
import TokenService from '../../../services/TokenService';
// Types
import { Dispatch, RootState } from '../../../store';
import pageToViewPathStorageName from '../../../routes/storageName';
import isAdmin from '../../../utils/userRole';

const UserDropdown: FC = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const handleLogOut = useCallback(() => {
    TokenService.delete();
    dispatch.auth.clear();
    dispatch.projectsList.clear();
    dispatch.profile.clear();
    dispatch.store.clear();
    localStorage.removeItem(pageToViewPathStorageName);
  }, [dispatch]);

  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);
  const decodedToken = useSelector(
    (state: RootState) => state.auth.decodedToken,
  );

  return (
    <Flex
      sx={{ cursor: 'pointer' }}
      ref={buttonRef}
      alignItems="center"
      justifyContent="center"
      mr="10px"
      ml="10px"
      onClick={() => handleToggle()}
    >
      {children}
      {isOpen && (
        <Box sx={{ position: 'absolute', right: '10px', top: '60px' }}>
          <List>
            <ListItem onClick={() => navigate('/account')}>
              Account settings
            </ListItem>
            {isAdmin(decodedToken) && (
              <ListItem onClick={() => navigate('/settings')}>
                Cluster settings
              </ListItem>
            )}
            <ListItem onClick={handleLogOut}>Log out</ListItem>
          </List>
        </Box>
      )}
    </Flex>
  );
};

export default UserDropdown;
