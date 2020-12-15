import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Subtitle, Value, Button, IconButton } from '@logicalclocks/quartz';
// eslint-disable-next-line import/no-unresolved
import { TooltipProps } from '@logicalclocks/quartz/dist/components/tooltip';

export interface PanelProps {
  onClickEdit: () => void;
  onClickRefresh: () => void;
  title: string;
  id: number;
  hasCommitDropdown?: boolean;
  commitDropdown?: React.ReactElement;
  hasVersionDropdown?: boolean;
  versionDropdown?: React.ReactElement;
  idColor: string;
}

const panelStyles = {
  bg: 'white',
  position: 'absolute',
  top: 0,
  left: 0,
  boxShadow: '0px 4px 163px -99px rgba(0, 0, 0, 0.25)',

  // Top shadow
  ':after': {
    content: '""',
    width: '100%',
    height: '10px',
    position: 'absolute',
    top: '-10px',
  },
};

const Panel: FC<PanelProps> = ({
  onClickEdit,
  onClickRefresh,
  title,
  id,
  hasCommitDropdown,
  commitDropdown,
                                 idColor,
  hasVersionDropdown = false,
  versionDropdown,
}) => (
  <Flex alignItems="center" height="50px" sx={panelStyles} width="100%">
    <Flex alignItems="flex-end">
      <Subtitle ml="30px">{title}</Subtitle>

      <Value mt="auto" ml="5px" mr="15px" sx={{ color: idColor }}>
        #{id}
      </Value>

      {hasVersionDropdown && versionDropdown}
      {hasCommitDropdown && commitDropdown}
    </Flex>
    <Flex ml="auto">
      <Button intent="ghost" onClick={onClickEdit}>
        edit
      </Button>
      <IconButton
        tooltip="Refresh"
        icon="sync-alt"
        tooltipProps={{ ml: '15px', mr: '50px' } as TooltipProps}
        onClick={onClickRefresh}
      />
    </Flex>
  </Flex>
);

export default Panel;
