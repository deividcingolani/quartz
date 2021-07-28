// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Card, Divider, Labeling, Value } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import { Jobs } from '../../../../types/jobs';
import icons from '../../../../sources/icons';
import DatasetService, {
  DatasetType,
} from '../../../../services/project/DatasetService';

export interface ContentProps {
  job: Jobs;
}

const SparkConfigurationOverview: FC<ContentProps> = ({ job }) => {
  const navigate = useNavigateRelative();
  const getHref = useGetHrefForRoute();

  const { id } = useParams();

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
            href={getHref('/edit', '/p/:id/jobs/:jobId/*')}
            onClick={() => navigate('/edit', '/p/:id/jobs/:jobId/*')}
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
            Driver memory (MB)
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config.amMemory}
          </Value>
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Driver virtual cores
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config.amVCores}
          </Value>
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Executor memory (MB)
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config['spark.executor.memory']}
          </Value>
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Executor virtual cores
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config['spark.executor.cores']}
          </Value>
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Mode
          </Labeling>
          {job.config['spark.dynamicAllocation.enabled'] && (
            <Value
              sx={{
                mt: '4px',
              }}
            >
              Dynamic {job.config['spark.dynamicAllocation.minExecutors']} to{' '}
              {job.config['spark.dynamicAllocation.maxExecutors']}
            </Value>
          )}
          {!job.config['spark.dynamicAllocation.enabled'] && (
            <Value
              sx={{
                mt: '4px',
              }}
            >
              Static
            </Value>
          )}
        </Flex>
        <Flex flexDirection="column" mr="20px">
          <Labeling
            gray
            sx={{
              fontSize: '10px',
            }}
          >
            Main class
          </Labeling>
          <Value
            sx={{
              mt: '4px',
            }}
          >
            {job.config.mainClass}
          </Value>
        </Flex>
      </Flex>
      <Divider />
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Additional archives
          {job.config['spark.yarn.dist.archives'] ? (
            <>
              {job.config['spark.yarn.dist.archives'].split(',').map((f) => {
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
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Additional jars
          {job.config['spark.yarn.dist.jars'] ? (
            <>
              {job.config['spark.yarn.dist.jars'].split(',').map((f) => {
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
                      <Value width="2%">{icons.download}</Value>
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
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Additional Python dependencies
          {job.config['spark.yarn.dist.pyFiles'] ? (
            <>
              {job.config['spark.yarn.dist.pyFiles'].split(',').map((f) => {
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
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Additional files
          {job.config['spark.yarn.dist.files'] ? (
            <>
              {job.config['spark.yarn.dist.files'].split(',').map((f) => {
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
      <Divider />
      <Flex flexDirection="column" mb="20px">
        <Labeling gray>
          Properties
          {job.config.properties ? (
            job.config.properties.split('\n').map((f) => {
              return <Value>{f}</Value>;
            })
          ) : (
            <Value>-</Value>
          )}
        </Labeling>
      </Flex>
    </Card>
  );
};

export default SparkConfigurationOverview;
