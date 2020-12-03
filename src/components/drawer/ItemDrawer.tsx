import React, { ComponentType, useCallback, useMemo, useState } from 'react';
import {
  Drawer,
  Microlabeling,
  Row,
  Select,
  TextValueBadge,
  Value,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import useNavigateRelative from '../../hooks/useNavigateRelative';
import routeNames from '../../routes/routeNames';
import useJobRowData from '../../hooks/useJobRowData';
import useSchematisedTagsRowData from '../../hooks/useSchematisedTagsRowData';
import Loader from '../loader/Loader';
import { DataEntity } from '../../types';

export enum ItemDrawerTypes {
  fg = 'fg',
  td = 'td',
}

export interface FeatureGroupDrawerProps<T extends DataEntity> {
  id: number;
  data: T[];
  handleToggle: () => void;
  navigateTo: (to: number) => string;
  type?: ItemDrawerTypes;
  isOpen: boolean;
}

const ItemDrawer = <T extends DataEntity>({
  id,
  handleToggle,
  data,
  isOpen,
  navigateTo,
  type = ItemDrawerTypes.fg,
}: FeatureGroupDrawerProps<T>) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route, routeNames.project.view);
    },
    [navigate],
  );

  const [jobComponents, jobProps] = useJobRowData([]);
  const [lastTrainingJobComponents, lastTrainingJobProps] = useJobRowData([]);
  const [
    schematisedTagsComponents,
    schematisedTagsProps,
  ] = useSchematisedTagsRowData([]);

  const [itemId, setId] = useState(id);

  const item = useMemo(() => data.find(({ id }) => id === itemId), [
    itemId,
    data,
  ]);

  const handleVersionChange = useCallback(
    (values) => {
      const newId = data.find(
        ({ version, name }) =>
          version === +values[0].split(' ')[0] && name === item?.name,
      )?.id;
      if (newId) {
        setId(newId);
      }
    },
    [data, item],
  );

  const latestVersion = useMemo(() => {
    const versions = data
      .filter(({ name }) => name === item?.name)
      .map(({ version }) => version.toString());
    return versions.sort((v1, v2) => -v1.localeCompare(v2))[0];
  }, [data, item]);

  const versions = useMemo(() => {
    const versions = data.filter(({ name }) => name === item?.name);
    return versions.map(
      ({ version }) =>
        `${version.toString()} ${
          version.toString() === latestVersion ? '(latest)' : ''
        }`,
    );
  }, [item, data, latestVersion]);

  if (!item) {
    return <Loader />;
  }

  return (
    <Drawer
      mt="10px"
      bottom="20px"
      closeOnBackdropClick={false}
      isOpen={isOpen}
      headerSummary={
        <Box height="100%">
          <Flex height="100%">
            <TextValueBadge text="features" value={item.features.length} />
            <TextValueBadge ml="10px" text="rows" value="81M" />
            <TextValueBadge ml="10px" text="commits" value={32} />
            <TextValueBadge ml="10px" text="training datasets" value={32} />
          </Flex>
          <Box mt="30px">
            <Microlabeling gray>Location</Microlabeling>
            <Value sx={{ wordBreak: 'break-all' }} primary>
              {item.location}
            </Value>
          </Box>
        </Box>
      }
      bottomButton={[
        `Open ${
          type === ItemDrawerTypes.fg ? "Feature Group's" : "Training Dataset's"
        } Page ->`,
        handleNavigate(navigateTo(itemId)),
      ]}
      onClose={handleToggle}
    >
      <Drawer.Section title="Versions">
        <Select
          width="143px"
          listWidth="100%"
          value={[
            `${item.version.toString()} ${
              item.version.toString() === latestVersion ? '(latest)' : ''
            }`,
          ]}
          options={versions}
          placeholder="version"
          onChange={handleVersionChange}
        />
      </Drawer.Section>
      <Drawer.Section
        title="Last Ingestion Job"
        action={['view all injection jobs -->', () => ({})]}
      >
        <Row
          middleColumn={1}
          groupComponents={jobComponents as ComponentType<any>[][]}
          groupProps={jobProps}
        />
      </Drawer.Section>

      {type === ItemDrawerTypes.td ? (
        <Drawer.Section
          title="Last Training Job"
          action={['view all training jobs -->', () => ({})]}
        >
          <Row
            middleColumn={1}
            groupComponents={
              lastTrainingJobComponents as ComponentType<any>[][]
            }
            groupProps={lastTrainingJobProps}
          />
        </Drawer.Section>
      ) : null}

      <Drawer.Section
        title="Schematised Tags"
        action={['template_1', () => ({})]}
      >
        <Box height="100%">
          <Row
            middleColumn={1}
            groupComponents={
              schematisedTagsComponents as ComponentType<any>[][]
            }
            groupProps={schematisedTagsProps}
          />
        </Box>
      </Drawer.Section>
    </Drawer>
  );
};

export default ItemDrawer;
