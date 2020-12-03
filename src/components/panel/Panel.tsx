import React, { FC, useCallback, useMemo } from 'react';
import { Flex } from 'rebass';
import {
  Subtitle,
  Value,
  Button,
  IconButton,
  Select,
} from '@logicalclocks/quartz';
// eslint-disable-next-line import/no-unresolved
import { TooltipProps } from '@logicalclocks/quartz/dist/components/tooltip';
import { FeatureGroup } from '../../types/feature-group';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import useNavigateRelative from '../../hooks/useNavigateRelative';
import routeNames from '../../routes/routeNames';

export interface PanelProps {
  onClickEdit: () => void;
  onClickRefresh: () => void;
  title: string;
  id: number;
  data?: FeatureGroup;
  hasDropdown?: boolean;
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
  data,
  hasDropdown = false,
}) => {
  const navigate = useNavigateRelative();

  const featureGroups = useSelector((state: RootState) => state.featureGroups);

  const latestVersion = useMemo(() => {
    const versions = featureGroups
      .filter(({ name }) => name === data?.name)
      .map(({ version }) => version.toString());
    return versions[versions.length - 1];
  }, [data, featureGroups]);

  const versions = useMemo(() => {
    const versions = featureGroups.filter(({ name }) => name === data?.name);
    return versions.map(
      ({ version }) =>
        `${version.toString()} ${
          version.toString() === latestVersion ? '(latest)' : ''
        }`,
    );
  }, [data, latestVersion, featureGroups]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = featureGroups.find(
        ({ version, name }) =>
          version === +values[0].split(' ')[0] && name === data?.name,
      )?.id;

      navigate(`/fg/${newId}`, routeNames.project.view);
    },
    [data, featureGroups, navigate],
  );

  return (
    <Flex alignItems="center" height="50px" sx={panelStyles} width="100%">
      <Flex alignItems="flex-end">
        <Subtitle ml="30px">{title}</Subtitle>

        <Value mt="auto" ml="5px" mr="15px" sx={{ color: 'labels.orange' }}>
          #{id}
        </Value>
        {hasDropdown && (
          <Select
            mb="-5px"
            width="143px"
            listWidth="100%"
            value={[
              `${data?.version.toString()} ${
                data?.version.toString() === latestVersion ? '(latest)' : ''
              }`,
            ]}
            options={versions}
            placeholder="version"
            onChange={handleVersionChange}
          />
        )}
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
};

export default Panel;
