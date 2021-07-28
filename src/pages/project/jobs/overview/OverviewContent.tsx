// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import {
  Button,
  Card,
  Labeling,
  NotificationsManager,
  usePopup,
  Value,
} from '@logicalclocks/quartz';
import { useParams } from 'react-router-dom';
import Panel from '../../../../components/panel/Panel';
import { FrameworkType, Jobs } from '../../../../types/jobs';
import SummaryData from './SummaryData';
import icons from '../../../../sources/icons';
import DatasetService, {
  DatasetType,
} from '../../../../services/project/DatasetService';
import getPathAndFileName from '../utils/getPathAndFileName';
import NotificationTitle from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';
import JobsExecutionsPopup from '../executions/JobsExecutionsPopup';
import saveToFile from '../../../../utils/downloadConfig';
import SparkConfigurationOverview from './SparkConfigurationOverview';
import PythonConfigurationOverview from './PythonConfigurationOverview';

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
  const { fileName, path } = getPathAndFileName(data.config.appPath);
  const [jobDownloadable, setJobDownloadable] = useState<boolean>(true);

  useEffect(() => {
    DatasetService.getDownloadToken(
      +id,
      `${path}/${fileName}`,
      DatasetType.DATASET,
    )
      .then(() => {
        setJobDownloadable(true);
      })
      .catch(() => {
        setJobDownloadable(false);
      });
  }, [fileName, id, path, setJobDownloadable]);

  const handleDownloadJob = useCallback(async () => {
    DatasetService.download(
      +id,
      `${path}/${fileName}`,
      DatasetType.DATASET,
    ).catch((_e) => {
      NotificationsManager.create({
        isError: true,
        type: <NotificationTitle message="Error" />,
        content: <NotificationContent message="Error downloading the file" />,
      });
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
                  {data.jobType}
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
      {data.config.type === FrameworkType.SPARK && (
        <SparkConfigurationOverview job={data} />
      )}
      {data.config.type === FrameworkType.PYTHON && (
        <PythonConfigurationOverview job={data} />
      )}
    </Box>
  );
};

export default OverviewContent;
