import { Flex } from 'rebass';
import React, { FC, memo, useCallback } from 'react';
import {
  Button,
  Card,
  FreshnessBar,
  Labeling,
  Microlabeling,
  Value,
} from '@logicalclocks/quartz';
import { useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
// Types
import { Project } from '../../../types/project';
// Components
import DateValue from '../feature-group/list/DateValue';
import ProjectMembers from './ProjectMembers';
import Integrations from './Integrations';

export interface ContentProps {
  data: Project;
  onClickEdit: () => void;
}

const OverviewContent: FC<ContentProps> = ({ data, onClickEdit }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/p/${data.projectId}/edit`);
  }, [data, navigate]);

  return (
    <>
      <Card
        actions={
          <Button mr="-10px" intent="inline" onClick={onClickEdit}>
            edit
          </Button>
        }
        title="Project overview"
      >
        <Flex flexDirection="column">
          {data.description ? (
            <Labeling mt="15px" gray>
              {data.description}
            </Labeling>
          ) : (
            <Button variant="inline" p="0" mt="15px" onClick={handleNavigate}>
              + add a description
            </Button>
          )}

          <Flex mt="25px" alignItems="center">
            {!!data.created && (
              <>
                <Flex width="max-content" flexDirection="column" mr="30px">
                  <Microlabeling gray mb="3px" width="100%">
                    Last update
                  </Microlabeling>
                  <Flex alignItems="center">
                    <FreshnessBar time={data.created.replace('T', ' ')} />
                    <Value fontFamily="Inter" ml="5px" primary>
                      {formatDistance(new Date(data.created), new Date())} ago
                    </Value>
                  </Flex>
                </Flex>
                <DateValue
                  mr="20px"
                  label="Created on"
                  date={new Date(data.created)}
                />
              </>
            )}
            <Flex flexDirection="column">
              <Microlabeling mb="3px" gray>
                Storage Connectors
              </Microlabeling>
              <Value primary>{data.projectId}</Value>
            </Flex>
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Feature Groups
              </Microlabeling>
              <Value primary>{data.featureGroupsCount}</Value>
            </Flex>
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Training Datasets
              </Microlabeling>
              <Value primary>{data.trainingDatasetsCount}</Value>
            </Flex>
          </Flex>
        </Flex>
      </Card>
      {!!data.projectTeam && <ProjectMembers data={data} />}
      <Integrations />
    </>
  );
};

export default memo(OverviewContent);
