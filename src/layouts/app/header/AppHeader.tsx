// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { Header, Label, User, Value, Labeling } from '@logicalclocks/quartz';

// Components
import { Box } from 'rebass';
import BasketMenu from './Basket';
import ProjectsDropdown from './ProjectsDropdown';
import HelpDropdown from './HelpDropdown';
import UserDropdown from './UserDropdown';
// Types
import { RootState } from '../../../store';
// Services
import ProfileService from '../../../services/ProfileService';
// Selectors
import selectProjectId from '../../../store/models/localManagement/store.selectors';
import Search from '../../../components/search/Search';
import icons from '../../../sources/icons';

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

  const location = useLocation();

  const handleNavigate = useCallback(() => {
    if (lastProjectId) {
      navigate(`p/${lastProjectId}`);
    } else {
      navigate(`/`);
    }
  }, [lastProjectId, navigate]);

  // Only show the basket in the feature groups section
  const showBasket = !!matchPath('/p/:id/fs/:fsId/fg/*', location.pathname);

  return (
    <Header
      logoAction={() => navigate('/')}
      menuAction={
        <UserDropdown>
          <Box p="5px">{icons.more}</Box>
        </UserDropdown>
      }
      user={
        <>
          {firstname && email && lastname ? (
            <UserDropdown>
              <User name={firstname} photo={ProfileService.avatar(email)} />
              <Label ml="10px" pointer>{`${firstname} ${lastname}`}</Label>
            </UserDropdown>
          ) : (
            <Labeling gray>loading...</Labeling>
          )}
        </>
      }
      actions={[
        <>
          {showBasket && <BasketMenu />}
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
          &#8701; back to {name || 'project list'}
        </Value>
      )}
    </Header>
  );
};

export default AppHeader;
