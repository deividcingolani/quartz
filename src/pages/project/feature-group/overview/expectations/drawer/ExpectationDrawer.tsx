// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType } from 'react';
import { Box, Flex } from 'rebass';
import { Button, Drawer, Labeling, Row, Value } from '@logicalclocks/quartz';

import { useNavigate, useParams } from 'react-router-dom';
import Rules from './Rules';
import Loader from '../../../../../../components/loader/Loader';

import { FeatureGroup } from '../../../../../../types/feature-group';
import Activity from './Activity';
import routeNames from '../../../../../../routes/routeNames';
import getHrefNoMatching from '../../../../../../utils/getHrefNoMatching';

export interface ExpectationDrawerProps {
  name: string;
  isOpen: boolean;
  data: FeatureGroup;
  handleToggle: () => void;
}

const ExpectationDrawer = ({
  name,
  data,
  isOpen,
  handleToggle,
}: ExpectationDrawerProps) => {
  const navigate = useNavigate();
  const { fsId, fgId, id } = useParams();

  const item = data.expectations.find((exp) => exp.name === name);

  if (!item) {
    return (
      <Drawer
        mt="10px"
        bottom="20px"
        singleBottom={false}
        isOpen={isOpen}
        onClose={handleToggle}
      >
        <Loader />
      </Drawer>
    );
  }

  return (
    <Drawer
      mt="10px"
      bottom="20px"
      singleBottom={false}
      headerLine={
        <Flex alignItems="center">
          <Value mr="10px">{name}</Value>
          <Button
            onClick={() =>
              navigate(
                getHrefNoMatching(
                  routeNames.expectation.edit,
                  routeNames.project.value,
                  true,
                  { fsId, fgId, id, expName: item.name },
                ),
              )
            }
            intent="ghost"
          >
            Edit
          </Button>
        </Flex>
      }
      isOpen={isOpen}
      onClose={handleToggle}
      bottomButton={
        <Flex mb="15px" justifyContent="center">
          <Button
            intent="ghost"
            onClick={() =>
              navigate(
                getHrefNoMatching(
                  routeNames.featureGroup.activityValidations,
                  routeNames.project.value,
                  true,
                  { fsId, fgId, id },
                ),
              )
            }
          >
            View full expectation activity
          </Button>
        </Flex>
      }
    >
      <Box>
        <Drawer.Section title="Rules">
          <Rules expectation={item} />
        </Drawer.Section>
        <Drawer.Section title="Features">
          <Box
            sx={{
              borderRightStyle: 'solid',
              borderRightWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftWidth: '1px',
              borderColor: 'grayShade2',
              width: '100%',

              table: {
                td: {
                  pl: '10px !important',
                  pr: '14px !important',
                  whiteSpace: 'nowrap',
                },
              },
            }}
          >
            <Row
              middleColumn={0}
              groupComponents={[[Value]]}
              groupProps={[[{ children: item.features.join(',') }]]}
            />
          </Box>
        </Drawer.Section>
        <Drawer.Section title="Attached feature groups">
          <Box
            sx={{
              borderRightStyle: 'solid',
              borderRightWidth: '1px',
              borderLeftStyle: 'solid',
              borderLeftWidth: '1px',
              borderColor: 'grayShade2',
              width: '100%',

              table: {
                td: {
                  pl: '10px !important',
                  pr: '14px !important',
                  whiteSpace: 'nowrap',
                },
              },
            }}
          >
            <Row
              middleColumn={0}
              groupComponents={[[Value]] as ComponentType<any>[][]}
              groupProps={[
                [
                  {
                    children:
                      item?.attachedFeatureGroups
                        ?.map(({ name }) => name)
                        .join(', ') || data.name,
                    sx: {
                      whiteSpace: 'break-spaces',
                    },
                  },
                ],
              ]}
            />
          </Box>
        </Drawer.Section>
        <Drawer.Section title="Activity">
          {data.lastValidation?.length ? (
            <Activity expectation={item} id={data.id} />
          ) : (
            <Labeling gray>No last activity</Labeling>
          )}
        </Drawer.Section>
      </Box>
    </Drawer>
  );
};

export default ExpectationDrawer;
