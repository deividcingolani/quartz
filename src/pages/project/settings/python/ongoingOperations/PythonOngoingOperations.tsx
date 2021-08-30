// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ComponentType,
  FC,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
// Components
import { Box, Flex } from 'rebass';
import {
  Badge,
  Labeling,
  Row,
  RowButton,
  TinyPopup,
  usePopup,
  Value,
  Tooltip,
  Code,
  AlternativeHeader,
} from '@logicalclocks/quartz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import styles from './operations.list.styles';
import NoData from '../../../../../components/no-data/NoData';

import {
  OngoingOperationStatus,
  OngoingOperationType,
  PythonCommandDTO,
  PythonEnvironmentDTO,
  PythonLibraryDTO,
} from '../../../../../types/python';
import { Dispatch } from '../../../../../store';
import icons from '../../../../../sources/icons';
import DatasetService, {
  DatasetType,
} from '../../../../../services/project/DatasetService';

export interface PythonOngoingOperationsProps {
  data: PythonCommandDTO[];
  isLoadingOperations: boolean;
}

interface Label {
  name: string;
  description: string;
}
const labels: Map<OngoingOperationType, Label> = new Map([
  [
    OngoingOperationType.SYNC_BASE_ENV,
    {
      name: 'PythonEnvironment synchronisation',
      description: 'Listing libraries in base environment.',
    },
  ],
  [
    OngoingOperationType.IMPORT,
    {
      name: 'PythonEnvironment import',
      description:
        'Creating an environment from a environment.yml or requirements.txt file.',
    },
  ],
  [
    OngoingOperationType.EXPORT,
    {
      name: 'PythonEnvironment export',
      description: 'Exporting the environment as an environment.yml file.',
    },
  ],
  [
    OngoingOperationType.CREATE,
    {
      name: 'PythonEnvironment creation',
      description:
        'Create an environment for the project. \n This creates a copy of the base environment.',
    },
  ],
  [
    OngoingOperationType.REMOVE,
    {
      name: 'PythonEnvironment deletion',
      description: 'Delete an environment.',
    },
  ],
  [
    OngoingOperationType.INSTALL,
    {
      name: 'Library installation',
      description: 'Install a library.',
    },
  ],
  [
    OngoingOperationType.UNINSTALL,
    {
      name: 'Library uninstallation',
      description: 'Uninstall a library.',
    },
  ],
]);

const getVariant = (role: OngoingOperationStatus) => {
  const statusMap = new Map<OngoingOperationStatus, 'fail' | 'light' | 'bold'>([
    [OngoingOperationStatus.FAILED, 'fail'],
    [OngoingOperationStatus.NEW, 'bold'],
    [OngoingOperationStatus.ONGOING, 'light'],
  ]);
  return statusMap.get(role);
};

const PythonOngoingOperations: FC<PythonOngoingOperationsProps> = ({
  data: operations,
  isLoadingOperations,
}) => {
  const [touchedOperation, setTouchedOperation] = useState<
    PythonCommandDTO | undefined
  >(undefined);
  const dispatch = useDispatch<Dispatch>();
  const { id: projectId, version } = useParams();
  const [isDeletingOperation, setIsDeletingOperation] =
    useState<boolean>(false);
  const [isRetryingOperation, setIsRetryingOperation] =
    useState<boolean>(false);
  const [isLogPopupOpen, handleToggleLog] = usePopup(false);

  // ugly check that the source of an operation is an environment...
  const isEnvironment = (subject: PythonLibraryDTO | PythonEnvironmentDTO) => {
    return 'pythonVersion' in subject;
  };

  useEffect(() => {
    if (!touchedOperation) {
      return;
    }

    if (isDeletingOperation) {
      const op = async () => {
        if (isEnvironment(touchedOperation.subject!)) {
          await dispatch.pythonEnvironment.deleteEnvironmentCommands({
            id: +projectId,
            version,
          });
          return dispatch.pythonEnvironment.getPythonEnvironmentWithOperations({
            id: +projectId,
            version,
          });
        }
        await dispatch.pythonLibrary.deleteLibraryCommands({
          id: +projectId,
          version,
          name: (touchedOperation.subject as PythonLibraryDTO).library,
        });
        return dispatch.pythonLibrary.getLibrariesWithOperations({
          id: +projectId,
          version,
        });
      };

      op().then(() => {
        setTouchedOperation(undefined);
        setIsDeletingOperation(false);
      });
    }

    if (isRetryingOperation) {
      const op = async () => {
        if (isEnvironment(touchedOperation.subject!)) {
          await dispatch.pythonEnvironment.retryEnvironmentCommands({
            id: +projectId,
            version,
          });
          return dispatch.pythonEnvironment.getPythonEnvironmentWithOperations({
            id: +projectId,
            version,
          });
        }

        await dispatch.pythonLibrary.retryLibraryCommands({
          id: +projectId,
          version,
          name: (touchedOperation.subject as PythonLibraryDTO).library,
        });
        return dispatch.pythonLibrary.getLibrariesWithOperations({
          id: +projectId,
          version,
        });
      };

      op().then(() => {
        setTouchedOperation(undefined);
        setIsRetryingOperation(false);
      });
    }
  }, [
    version,
    projectId,
    dispatch.pythonEnvironment,
    dispatch.pythonLibrary,
    touchedOperation,
    isDeletingOperation,
    isRetryingOperation,
  ]);

  const groupProps = useMemo(() => {
    return operations.map((operation) => [
      {
        children: (
          <Badge
            value={(operation.status as OngoingOperationStatus).toLowerCase()}
            variant={getVariant(operation.status as OngoingOperationStatus)!}
          />
        ),
      },
      {
        variant: 'bold',
        children: labels.get(operation.op)!.name,
      },
      {
        variant: 'bold',
        children:
          'library' in operation.subject! ? operation.subject!.library! : '',
      },
      {
        children: labels.get(operation.op)!.description,
        gray: true,
      },
      {
        children:
          (operation.status as OngoingOperationStatus) !==
          OngoingOperationStatus.FAILED ? (
            <></>
          ) : (
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <RowButton
                icon={<FontAwesomeIcon icon="terminal" />}
                onClick={() => {
                  setTouchedOperation(operation);
                  handleToggleLog();
                }}
                mainText="logs"
                disabled={
                  (isDeletingOperation && touchedOperation === operation) ||
                  (isRetryingOperation && touchedOperation === operation)
                }
              />
              <RowButton
                icon={<FontAwesomeIcon icon="redo-alt" />}
                onClick={() => {
                  setTouchedOperation(operation);
                  setIsRetryingOperation(true);
                }}
                mainText="retry"
                disabled={
                  (isDeletingOperation && touchedOperation === operation) ||
                  (isRetryingOperation && touchedOperation === operation)
                }
              />
              {operation.op === OngoingOperationType.SYNC_BASE_ENV ? (
                <></>
              ) : (
                <RowButton
                  disabled={
                    (isDeletingOperation && touchedOperation === operation) ||
                    (isRetryingOperation && touchedOperation === operation)
                  }
                  icon={<FontAwesomeIcon icon="trash-alt" />}
                  onClick={() => {
                    setTouchedOperation(operation);
                    setIsDeletingOperation(true);
                  }}
                  mainText="delete"
                />
              )}
            </Flex>
          ),
      },
    ]);
  }, [
    isDeletingOperation,
    isRetryingOperation,
    touchedOperation,
    setIsDeletingOperation,
    handleToggleLog,
    operations,
  ]);

  const groupComponents = useMemo(() => {
    return operations.map(() => [Value, Value, Value, Labeling, Box]);
  }, [operations]);

  const handleDownloadJob = async () => {
    DatasetService.download(
      +projectId,
      touchedOperation!.errorMessage,
      DatasetType.DATASET,
    );
  };

  const getDownloadHandler = () => {
    if (touchedOperation) {
      const log = touchedOperation.errorMessage;
      if (log.startsWith('Log is too big to display in browser.')) {
        return handleDownloadJob;
      }
    }
    return undefined;
  };

  const ongoingOps = operations.filter(
    (operation) =>
      operation.status === OngoingOperationStatus.ONGOING ||
      operation.status === OngoingOperationStatus.NEW,
  );

  if (!operations.length && !isLoadingOperations) {
    return (
      <Box my="40px">
        <NoData mainText="No ongoing operations" />
      </Box>
    );
  }

  if (isLoadingOperations) {
    return (
      <Box my="40px">
        <NoData mainText="Loading..." />
      </Box>
    );
  }

  return (
    <>
      <TinyPopup
        px="0px"
        width="70%"
        height="calc(100vh - 40px)"
        secondaryText=""
        disabledMainButton={true}
        disabledSecondaryButton={true}
        title=""
        isOpen={isLogPopupOpen}
        onClose={() => {
          setTouchedOperation(undefined);
          handleToggleLog();
        }}
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
              onClick={() => handleToggleLog()}
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
          <AlternativeHeader
            title={
              // eslint-disable-next-line no-nested-ternary
              !touchedOperation
                ? ''
                : isEnvironment(touchedOperation.subject!)
                ? touchedOperation.op
                : `${touchedOperation.op} ${
                    (touchedOperation.subject! as PythonLibraryDTO).library
                  }`
            }
            tabs={[]}
          />
        </Box>
        <Code
          title={format(new Date(), 'yyyy-MM-dd hh:mm:ss')}
          isColorSyntax={false}
          wrapLongLines
          copyButton
          downloadButton
          downloadCallback={getDownloadHandler()}
          content={touchedOperation ? touchedOperation.errorMessage : ''}
        />
      </TinyPopup>

      <Box width="100%" mb="8px">
        <Flex mb="20px">
          <Value>Currently </Value>
          <Value primary mx="3px">
            {ongoingOps.length}
          </Value>
          <Value>
            {' '}
            ongoing operation
            {ongoingOps.length === 1 ? '' : 's'}
          </Value>
        </Flex>
      </Box>
      <Box sx={styles}>
        <Row
          middleColumn={5}
          groupProps={groupProps}
          groupComponents={groupComponents as ComponentType<any>[][]}
        />
      </Box>
    </>
  );
};

export default memo(PythonOngoingOperations);
