import React, { FC, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header, Label, User, Value } from '@logicalclocks/quartz';

// Components
import ProjectsDropdown from './ProjectsDropdown';
import HelpDropdown from './HelpDropdown';
import UserDropdown from './UserDropdown';
// Types
import { RootState } from '../../../store';
// Services
import ProfileService from '../../../services/ProfileService';
// Selectors
import { selectProjectId } from '../../../store/models/localManagement/store.selectors';

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

  return (
    <Header
      logoAction={() => navigate('/')}
      menuAction={<UserDropdown />}
      user={
        <>
          {!!(firstname && email && lastname) && (
            <>
              <User name={firstname} photo={ProfileService.avatar(email)} />
              <Label ml="10px">{`${firstname} ${lastname}`}</Label>
            </>
          )}
        </>
      }
      actions={[<HelpDropdown />]}
    >
      {showList && !hasBackButton && <ProjectsDropdown />}
      {hasBackButton && (
        <Value
          sx={{ cursor: 'pointer' }}
          fontSize="18px"
          primary
          onClick={handleNavigate}
        >
          {' '}
          &#8701; back to {!!name ? name : 'project list'}
        </Value>
      )}
    </Header>
  );
};

export default AppHeader;
