// eslint-disable-next-line import/no-unresolved
import { DropdownItem } from 'quartz-design-system/dist/components/dropdown/types';
import React, { FC, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import {
  FolderIcon,
  Dropdown,
  Subtitle,
  useDropdown,
} from 'quartz-design-system';

const Button = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 5px;
  cursor: pointer;
`;

const ProjectsButton: FC = () => {
  const [isOpen, handleToggle, handleClickOutside] = useDropdown();

  const handleItemClick = useCallback((data): void => {
    console.log(data);
  }, []);

  const items = useMemo<DropdownItem[]>(
    () => [
      {
        value: 'project_1',
        metadata: {},
        onClick: handleItemClick,
      },
      {
        value: 'project_2',
        metadata: {},
        hasDivider: true,
        onClick: handleItemClick,
      },
      {
        value: 'Create New Project',
        icon: 'plus',
        metadata: {},
        onClick: handleItemClick,
      },
    ],
    [handleItemClick],
  );

  return (
    <Button onClick={(): void => handleToggle()}>
      <FolderIcon />
      <Subtitle ml="16px">PROJECT ACME</Subtitle>
      <Dropdown
        sx={{
          position: 'absolute',
          top: '100%',
        }}
        isOpen={isOpen}
        items={items}
        onClickOutside={handleClickOutside}
      >
        <div />
      </Dropdown>
    </Button>
  );
};

export default ProjectsButton;
