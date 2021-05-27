import React, { FC, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  Label,
  User,
  Value,
  Labeling,
  useDropdown,
  useOnClickOutside,
  List,
  ListItem,
} from '@logicalclocks/quartz';

// Components
import BasketMenu from './Basket';
import ProjectsDropdown from './ProjectsDropdown';
import HelpDropdown from './HelpDropdown';
import UserDropdown from './UserDropdown';
// Types
import { Dispatch, RootState } from '../../../store';
// Services
import ProfileService from '../../../services/ProfileService';
// Selectors
import { selectProjectId } from '../../../store/models/localManagement/store.selectors';
import Search from '../../../components/search/Search';
import TokenService from '../../../services/TokenService';
import { pageToViewPathStorageName } from '../../../routes';
import { Box, Flex } from 'rebass';

export interface AppHeaderProps {
  showList?: boolean;
  hasBackButton?: boolean;
}

const AppHeader: FC<AppHeaderProps> = ({
  showList = true,
  hasBackButton = false,
}) => {
  const user = useSelector((state: RootState) => state.profile);

  const navigate = useNavigate();

  const lastProjectId = useSelector(selectProjectId);

  const projects = useSelector((state: RootState) => state.projectsList);

  const name = projects.find(({ id }) => lastProjectId === id)?.name;

  const { firstname, lastname, email } = user;

  const handleNavigate = useCallback(() => {
    if (lastProjectId) {
      navigate(`p/${lastProjectId}`);
    } else {
      navigate(`/`);
    }
  }, [lastProjectId, navigate]);

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

  return (
    <Header
      logoAction={() => navigate('/')}
      menuAction={<UserDropdown />}
      user={
        <>
          {!!(firstname && email && lastname) ? (
            <Flex
              onClick={() => handleToggle()}
              ref={buttonRef}
              alignItems="center"
              justifyContent="center"
              sx={{
                cursor: 'pointer',
              }}
            >
              <User name={firstname} photo={ProfileService.avatar(email)} />
              <Label ml="10px" pointer>{`${firstname} ${lastname}`}</Label>
              {isOpen && (
                <Box sx={{ position: 'absolute', right: '10px', top: '60px' }}>
                  <List>
                    <ListItem onClick={() => navigate('/account')}>
                      Account settings
                    </ListItem>
                    <ListItem onClick={() => navigate('/settings')}>
                      Cluster settings
                    </ListItem>
                    <ListItem onClick={handleLogOut}>Log out</ListItem>
                  </List>
                </Box>
              )}
            </Flex>
          ) : (
            <Labeling gray>loading...</Labeling>
          )}
        </>
      }
      actions={[
        <>
          <BasketMenu />
          <HelpDropdown />
        </>,
      ]}
    >
      {showList && !hasBackButton && (
        <>
          <ProjectsDropdown />
          <Search />
        </>
      )}
      {hasBackButton && (
        <Value
          sx={{ cursor: 'pointer' }}
          fontSize="18px"
          primary
          onClick={handleNavigate}
        >
          &#8701; back to {!!name ? name : 'project list'}
        </Value>
      )}
    </Header>
  );
};

export default AppHeader;
