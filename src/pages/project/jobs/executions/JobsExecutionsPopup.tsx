// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  AlternativeHeader,
  Code,
  Input,
  NotificationsManager,
  TinyPopup,
  Tooltip,
} from '@logicalclocks/quartz';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Flex, Text, Box } from 'rebass';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArgumentsForRun, JobFormData } from '../types';
import icons from '../../../../sources/icons';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import NotificationBadge from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';
import { name } from '../../../../utils/validators';
import getInputValidation from '../../../../utils/getInputValidation';
import DatasetService, {
  DatasetType,
} from '../../../../services/project/DatasetService';
import Loader from '../../../../components/loader/Loader';

export interface JobsExecutionsPopupProps {
  projectId: number;
  item: any;
  isOpenPopup: boolean;
  handleTogglePopup: Dispatch<SetStateAction<boolean>>;
  handleStopExecutions?: (executionId: number) => void;
  isCopy?: boolean;
  isLog?: boolean;
  isStop?: boolean;
}

const JobsExecutionsPopup: FC<JobsExecutionsPopupProps> = ({
  projectId,
  isCopy = false,
  item,
  isOpenPopup,
  handleTogglePopup,
  handleStopExecutions,
  isLog = false,
  isStop = false,
}: JobsExecutionsPopupProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigateRelative();
  const [disabledQuickRunButton, setDisabledQuickRunButton] = useState(false);

  const [dataLog, setDataLog] = useState<any>(null);
  const [loading, setLoding] = useState<boolean>(true);

  const schema = yup.object().shape({
    appName: name.label('Name'),
  });

  const [active, setActive] = useState('stdout');

  const methods = useForm({
    defaultValues: {
      defaultArgs: '',
      appName: '',
      ...(!!item &&
        !isLog &&
        !isStop && {
          defaultArgs: item.config.defaultArgs,
          appName: `${format(new Date(), 'HH-mm-ss')}`,
        }),
    },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const getLogs = useCallback(async () => {
    const stdout = await dispatch.jobsExecutions.logs({
      projectId: item.projectId,
      jobName: item.jobName,
      executionId: item.executionId,
      logsType: 'out',
    });
    const stderr = await dispatch.jobsExecutions.logs({
      projectId: item.projectId,
      jobName: item.jobName,
      executionId: item.executionId,
      logsType: 'err',
    });

    const data = {
      stdout: stdout.data.log,
      stdoutPath: stdout.data.path,
      stderr: stderr.data.log,
      stderrPath: stderr.data.path,
    };
    if (data) {
      setDataLog(data);
      setLoding(false);
    }
  }, [dispatch.jobsExecutions, item.executionId, item.jobName, item.projectId]);

  useEffect(() => {
    async function fetchLogs() {
      if (isLog && item) {
        await getLogs();
      }
    }
    fetchLogs();
  }, [getLogs, isLog, item]);

  const handleDownloadJob = async () => {
    DatasetService.download(
      projectId,
      active === 'stdout' ? dataLog.stdoutPath : dataLog.stderrPath,
      DatasetType.DATASET,
    );
  };

  const getDownloadHandler = () => {
    const log =
      active === 'stdout' && dataLog ? dataLog.stdout : dataLog.stderr;
    if (log.startsWith('Log is too big to display in browser.')) {
      return handleDownloadJob;
    }
    return undefined;
  };

  const { control, handleSubmit, errors } = methods;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(async (data: ArgumentsForRun) => {
      setDisabledQuickRunButton(true);
      if (projectId && item && handleTogglePopup) {
        const res = await dispatch.jobs.run({
          projectId: +projectId,
          jobName: item.name,
          argumentsData: data.defaultArgs,
        });
        if (res.status === 201) {
          setDisabledQuickRunButton(false);
          NotificationsManager.create({
            isError: false,
            type: <NotificationBadge message="Success" variant="success" />,
            content: <NotificationContent message="Job started" />,
          });
          handleTogglePopup(!isOpenPopup);
        }
      }
    }),
    [handleSubmit, projectId],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onHandleCopy = useCallback(
    handleSubmit(async (data: JobFormData) => {
      const req = {
        type: item.config.type,
        appName: data.appName,
        mainClass: item.config.mainClass,
      };
      // eslint-disable-next-line no-param-reassign
      delete item.spark;
      handleTogglePopup(!isOpenPopup);
      const id = await dispatch.jobs.copy({
        projectId: +projectId,
        data: req,
      });

      dispatch.jobsView.fetch({
        projectId: +projectId,
        jobsName: data.appName,
      });
      navigate(`/jobs/${id}`, 'p/:id/*');
    }),
    [projectId],
  );

  const handleCancelCopy = () => {
    handleTogglePopup(!isOpenPopup);
  };

  const handleCancelStop = () => {
    handleTogglePopup(!isOpenPopup);
  };

  const tabs = useMemo(
    () => [
      {
        title: 'stdout',
        isActive: active === 'stdout',
        onCLick: () => setActive('stdout'),
      },
      {
        title: 'stderr',
        isActive: active === 'stderr',
        onCLick: () => setActive('stderr'),
      },
    ],
    [active],
  );

  return (
    <>
      {!isCopy && !isLog && !isStop && (
        <TinyPopup
          width="440px"
          isOpen={isOpenPopup}
          onClose={() => handleTogglePopup(!isOpenPopup)}
          title="Run job"
          secondaryText=""
          disabledMainButton={disabledQuickRunButton}
          secondaryButton={['Cancel', () => handleTogglePopup(!isOpenPopup)]}
          mainButton={['Run', onSubmit]}
        >
          <Box
            sx={{
              '>div': {
                p: '0px',
              },
              mb: '20px',
            }}
          >
            <FormProvider {...methods}>
              <Controller
                control={control}
                name="defaultArgs"
                render={({ onChange, value }) => (
                  <Input
                    label="Arguments"
                    name="arguments"
                    placeholder="enter arguments"
                    width="100%"
                    height="100%"
                    labelProps={{ width: '100%' }}
                    value={value}
                    onChange={(value: any) => onChange(value)}
                  />
                )}
              />
            </FormProvider>
          </Box>
        </TinyPopup>
      )}
      {isCopy && !isLog && !isStop && (
        <TinyPopup
          width="440px"
          isOpen={isOpenPopup}
          onClose={() => handleTogglePopup(!isOpenPopup)}
          title="Make a copy"
          mainButton={['Create copy', onHandleCopy]}
          secondaryText=""
          secondaryButton={['Cancel', handleCancelCopy]}
        >
          <FormProvider {...methods}>
            <Flex flexDirection="column">
              <Text
                sx={{
                  fontSize: '12px',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  mb: '20px',
                }}
              >
                Copy will create a new job with same file and configuration
              </Text>
            </Flex>
            <Controller
              control={control}
              defaultValue={`${item.name}${format(new Date(), 'dd-MM-yyyy')}`}
              name="appName"
              render={({ onChange, value }) => (
                <Input
                  name="name"
                  type="text"
                  width="100%"
                  height="100%"
                  label="Name of the new job"
                  labelProps={{ width: '100%', mb: '20px' }}
                  value={value}
                  onChange={(value: any) => onChange(value)}
                  {...getInputValidation('appName', errors)}
                />
              )}
            />
          </FormProvider>
        </TinyPopup>
      )}
      {isLog && !isStop && (
        <TinyPopup
          px="0px"
          width="1440px"
          height="calc(100vh - 40px)"
          isOpen={isOpenPopup}
          onClose={() => handleTogglePopup(!isOpenPopup)}
          title=""
          secondaryText=""
        >
          <Box sx={{ mt: '-40px', position: 'relative' }}>
            <Tooltip
              mainText="Close"
              sx={{
                zIndex: '33',
                position: 'absolute',
                top: '20px',
                right: '20px',
              }}
            >
              <Box
                onClick={() => handleTogglePopup(!isOpenPopup)}
                p="2px"
                height="30px"
                sx={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'transparent',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: 'grayShade3',
                    borderColor: 'grayShade3',
                  },
                }}
              >
                {icons.cross}
              </Box>
            </Tooltip>
            <AlternativeHeader title="Logs" tabs={tabs} />
          </Box>
          {loading && <Loader />}
          {dataLog && !loading && (
            <Code
              title={format(new Date(), 'yyyy-MM-dd hh:mm:ss')}
              isColorSyntax={false}
              wrapLongLines
              copyButton
              downloadButton
              downloadCallback={getDownloadHandler()}
              content={
                active === 'stdout' && dataLog ? dataLog.stdout : dataLog.stderr
              }
            />
          )}
        </TinyPopup>
      )}
      {isStop && (
        <TinyPopup
          px="0px"
          width="440px"
          isOpen={isOpenPopup}
          onClose={() => handleTogglePopup(!isOpenPopup)}
          title="Stop execution"
          secondaryText="Are you sure that you want to stop this execution?"
          mainButton={['Stop execution', () => handleStopExecutions]}
          secondaryButton={['Back', handleCancelStop]}
        />
      )}
    </>
  );
};
export default JobsExecutionsPopup;
