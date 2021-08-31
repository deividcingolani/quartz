// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useCallback } from 'react';
import { Flex } from 'rebass';
import { Labeling } from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';
import routeNames from '../../../routes/routeNames';
import icons from '../../../sources/icons';
import getHrefNoMatching from '../../../utils/getHrefNoMatching';

export interface FixedItem {
  label: string;
  key: string;
  href: string;
  icon: JSX.Element;
  onClick: () => void;
}

const FixedShortcuts: FC<{ fsId: string }> = ({ fsId }) => {
  const navigate = useNavigate();

  const { featureGroup, trainingDataset, project } = routeNames;
  const { id } = useParams();

  const buildHref = useCallback(
    (to: string, relativeTo: string) => {
      return getHrefNoMatching(to, relativeTo, true, { fsId, id });
    },
    [id, fsId],
  );

  const handleNavigate = useCallback(
    (to: string, relativeTo: string) => {
      navigate(buildHref(to, relativeTo));
    },
    [buildHref, navigate],
  );

  const fixedShortCuts: FixedItem[] = useMemo(
    () => [
      {
        label: 'Create New Feature Group',
        onClick: () => handleNavigate(featureGroup.create, project.value),
        href: buildHref(featureGroup.create, project.value),
        icon: icons.plus,
        key: 'fg',
      },
      {
        label: 'Create New Training Dataset',
        onClick: () => handleNavigate(trainingDataset.create, project.value),
        href: buildHref(trainingDataset.create, project.value),
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
      buildHref,
      handleNavigate,
      project.value,
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
