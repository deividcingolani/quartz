import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Header, Label, User } from '@logicalclocks/quartz';

// Components
import ProjectsDropdown from './ProjectsDropdown';
import HelpDropdown from './HelpDropdown';
import UserDropdown from './UserDropdown';
// Types
import { RootState } from '../../../store';
// Services
import ProfileService from '../../../services/ProfileService';
import { useNavigate } from 'react-router-dom';

export interface AppHeaderProps {
  showList?: boolean;
}

const AppHeader: FC<AppHeaderProps> = ({ showList = true }) => {
  const user = useSelector((state: RootState) => state.profile);

  const navigate = useNavigate();

  const { firstname, lastname, email } = user;

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
      {showList && <ProjectsDropdown />}
    </Header>
  );
};

export default AppHeader;
