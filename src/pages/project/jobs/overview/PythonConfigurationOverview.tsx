// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Card, Divider, Labeling, Value } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { Jobs } from '../../../../types/jobs';
import icons from '../../../../sources/icons';
import DatasetService, {
  DatasetType,
} from '../../../../services/project/DatasetService';
import routeNames from '../../../../routes/routeNames';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

export interface ContentProps {
  job: Jobs;
}

const PythonConfigurationOverview: FC<ContentProps> = ({ job }) => {
  const navigate = useNavigate();

  const { id, jobId } = useParams();

  const handleDownloadDependency = (path: string) => {
    DatasetService.download(
      +id,
      path.replace('hdfs://', ''),
      DatasetType.DATASET,
    );
  };

  return (
    <Card
      mt="20px"
      title="Configuration"
      contentProps={{ pb: 0, overflow: 'none' }}
      actions={
        job && (
          <Button
            p={0}
            intent="inline"
            href={getHrefNoMatching(
              routeNames.jobs.edit,
              routeNames.project.value,
              true,
              {
                id,
                jobId,
              },
            )}
            onClick={() =>
              navigate(
                getHrefNoMatching(
                  routeNames.jobs.edit,
                  routeNames.project.value,
                  true,
                  {
                    id,
                    jobId,
                  },
                ),
              )
            }
          >
            edit configuration
          </Button>
        )
      }
    >
      <Flex mb="20px">
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Container memory (MB)
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config.resourceConfig.memory}
          </Value>
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Container cores
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config.resourceConfig.cores}
          </Value>
        </Flex>
      </Flex>
      <Divider />
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Additional archives
          {job.config.files ? (
            <>
              {job.config.files.split(',').map((f) => {
                return (
                  <>
                    <Divider />
                    <Flex flexDirection="row">
                      <Value width="99%">{f.replace('hdfs://', '')}</Value>
                      <Button
                        intent="ghost"
                        padding="0px"
                        width="2%"
                        onClick={() => {
                          handleDownloadDependency(f);
                        }}
                      >
                        {icons.download}
                      </Button>
                    </Flex>
                  </>
                );
              })}
              <Divider mb="0px" />
            </>
          ) : (
            <Value>-</Value>
          )}
        </Labeling>
      </Flex>
    </Card>
  );
};

export default PythonConfigurationOverview;
