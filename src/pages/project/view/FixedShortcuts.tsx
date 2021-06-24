// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo } from 'react';
import { Flex } from 'rebass';
import { Labeling } from '@logicalclocks/quartz';
import useNavigateRelative from '../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';
import routeNames from '../../../routes/routeNames';
import icons from '../../../sources/icons';

export interface FixedItem {
  label: string;
  key: string;
  href: string;
  icon: JSX.Element;
  onClick: () => void;
}

const FixedShortcuts: FC = () => {
  const getHref = useGetHrefForRoute();
  const navigate = useNavigateRelative();

  const { featureGroup, trainingDataset, project } = routeNames;

  const fixedShortCuts: FixedItem[] = useMemo(
    () => [
      {
        label: 'Create New Feature Group',
        onClick: () => navigate(featureGroup.create, project.view),
        href: getHref(featureGroup.create, project.view),
        icon: icons.plus,
        key: 'fg',
      },
      {
        label: 'Create New Training Dataset',
        onClick: () => navigate(trainingDataset.create, project.view),
        href: getHref(trainingDataset.create, project.view),
        icon: icons.plus,
        key: 'td',
      },
      // { label: 'Create New Job', onClick: () => {}, key: 'job' },
      {
        label: 'Documentation',
        onClick: () => window.open('https://docs.hopsworks.ai/latest/'),
        href: 'https://docs.hopsworks.ai/latest/',
        icon: icons.documentation,
        key: 'doc',
      },
    ],
    [
      featureGroup.create,
      getHref,
      navigate,
      project.view,
      trainingDataset.create,
    ],
  );
  return (
    <>
      {fixedShortCuts.map((item) => (
        <Flex
          key={item.key}
          p="8px"
          alignItems="center"
          sx={{
            cursor: 'pointer',
            ':hover': {
              bg: 'grayShade2',
            },
          }}
          justifyContent="flex-start"
          onClick={item.onClick}
          href={item.href}
        >
          {item.icon}
          <Flex ml="4px">
            <Labeling bold>{item.label}</Labeling>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

export default FixedShortcuts;
