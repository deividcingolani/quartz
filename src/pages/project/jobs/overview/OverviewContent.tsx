// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Button, Card, Labeling, usePopup, Value } from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import Panel from '../../../../components/panel/Panel';
import { Jobs } from '../../../../types/jobs';
import SummaryData from './SummaryData';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import icons from '../../../../sources/icons';
import DatasetService, {
  DatasetType,
} from '../../../../services/project/DatasetService';
import setTypeOfJob from '../utils/setTypeOfJob';
import JobsExecutionsPopup from '../executions/JobsExecutionsPopup';
import saveToFile from '../../../../utils/downloadConfig';
import getPathAndFileName from '../utils/getPathAndFileName';

export interface ContentProps {
  data: Jobs;
  onClickRefresh: () => void;
  onClickEdit: () => void;
}

const OverviewContent: FC<ContentProps> = ({
  data,
  onClickRefresh,
  onClickEdit,
}) => {
  const { id } = useParams();
  const navigate = useNavigateRelative();
  const getHref = useGetHrefForRoute();
  const { fileName, path } = getPathAndFileName(data.config.appPath);
  const [jobDownloadable, setJobDownlodable] = useState<boolean>(true);

  useEffect(() => {
    DatasetService.getDownloadToken(
      +id,
      `${path}/${fileName}`,
      DatasetType.DATASET,
    )
      .then(() => {
        setJobDownlodable(true);
      })
      .catch(() => {
        setJobDownlodable(false);
      });
  }, [fileName, id, path, setJobDownlodable]);

  const handleDownloadJob = useCallback(async () => {
    DatasetService.getDownloadToken(
      +id,
      `${path}/${fileName}`,
      DatasetType.DATASET,
    ).then(({ data }) => {
      window.open(
        `${
          process.env.REACT_APP_API_HOST
        }/project/${id}/dataset/download/with_token/${encodeURIComponent(
          `${path}/${fileName}`,
        )}?token=${data.data.value}&type=${DatasetType.DATASET}`,
        '_blank',
      );
    });
  }, [id, fileName, path]);

  const [isOpenPopupForRun, handleTogglePopupForRun] = usePopup();
  const [isOpenPopupForCopy, handleTogglePopupForCopy] = usePopup();

  return (
    <Box>
      <JobsExecutionsPopup
        projectId={+id}
        item={data}
        isOpenPopup={isOpenPopupForRun}
        handleTogglePopup={handleTogglePopupForRun}
      />
      <JobsExecutionsPopup
        isCopy
        projectId={+id}
        item={data}
        isOpenPopup={isOpenPopupForCopy}
        handleTogglePopup={handleTogglePopupForCopy}
      />
      <Panel
        data={data}
        title={String(data?.name)}
        id={data.id}
        hasVersionDropdown
        idColor="gray"
        onClickEdit={onClickEdit}
        onClickRefresh={onClickRefresh}
      />
      {data && (
        <Flex mt="50px">
          <Flex
            flexDirection="column"
            sx={{
              minWidth: '420px',
            }}
          >
            <SummaryData data={data} />
          </Flex>
          <Flex width="100%" maxHeight="34px">
            <Flex justifyContent="space-between" width="100%">
              <Button
                intent="secondary"
                onClick={handleTogglePopupForRun}
                sx={{
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 700,
                  marginRight: 'auto',
                  borderRadius: '0px',
                }}
              >
                <Flex
                  sx={{
                    alignItems: 'center',
                    svg: {
                      marginRight: '10px',
                    },
                  }}
                >
                  {icons.play}Run
                </Flex>
              </Button>
              <Button
                onClick={handleTogglePopupForCopy}
                intent="secondary"
                sx={{
                  mr: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '0px',
                }}
              >
                Make a copy
              </Button>
              <Button
                intent="primary"
                onClick={() =>
                  saveToFile(data.config.appName, JSON.stringify(data.config))
                }
              >
                Export
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Card
        mt="20px"
        title="Job details"
        contentProps={{ pb: 0, overflow: 'none' }}
        maxHeight="184px"
      >
        <Flex flexDirection="column">
          <Flex justifyContent="space-between">
            <Flex>
              <Flex flexDirection="column" mr="20px">
                <Labeling
                  gray
                  sx={{
                    fontSize: '10px',
                  }}
                >
                  Framework
                </Labeling>
                <Value
                  sx={{
                    mt: '4px',
                  }}
                >
                  {setTypeOfJob(data.jobType)}
                </Value>
              </Flex>
              <Flex flexDirection="column" mr="20px">
                <Labeling
                  gray
                  sx={{
                    fontSize: '10px',
                  }}
                >
                  Location
                </Labeling>
                <Value
                  sx={{
                    mt: '4px',
                  }}
                >
                  {path}
                </Value>
              </Flex>
              <Flex flexDirection="column" mr="20px">
                <Labeling
                  gray
                  sx={{
                    fontSize: '10px',
                  }}
                >
                  File name
                </Labeling>
                <Value
                  sx={{
                    mt: '4px',
                  }}
                >
                  {fileName}
                </Value>
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
                  {data.config.mainClass}
                </Value>
              </Flex>
            </Flex>
            {path !== '-' && (
              <Button
                intent="secondary"
                onClick={handleDownloadJob}
                disabled={!jobDownloadable}
              >
                <Flex alignItems="center" justifyContent="center">
                  <Flex
                    sx={{
                      mr: '11px',
                      height: '15px',
                      alignItems: 'center',
                    }}
                  >
                    {icons.download}
                  </Flex>
                  <Flex alignItems="center">Download File</Flex>
                </Flex>
              </Button>
            )}
          </Flex>
          <Flex flexDirection="column" mt="20px" mb="16px">
            <Labeling
              gray
              sx={{
                fontSize: '10px',
              }}
            >
              Arguments
            </Labeling>
            <Value
              sx={{
                mt: '4px',
              }}
            >
              {data.config.defaultArgs || '-'}
            </Value>
          </Flex>
        </Flex>
      </Card>
      <Card
        mt="20px"
        title="Configuration"
        contentProps={{ pb: 0, overflow: 'none' }}
        maxHeight="184px"
        actions={
          data && (
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
        <Flex mb="16px">
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
              {data.config.amMemory}
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
              {data.config.amVCores}
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
              {data.config['spark.executor.memory']}
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
              {data.config['spark.executor.cores']}
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
            {data.config['spark.dynamicAllocation.enabled'] && (
              <Value
                sx={{
                  mt: '4px',
                }}
              >
                Dynamic {data.config['spark.dynamicAllocation.minExecutors']} to{' '}
                {data.config['spark.dynamicAllocation.maxExecutors']}
              </Value>
            )}
            {!data.config['spark.dynamicAllocation.enabled'] && (
              <Value
                sx={{
                  mt: '4px',
                }}
              >
                Static
              </Value>
            )}
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default OverviewContent;
