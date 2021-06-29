// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { useRef, useState } from 'react';
import {
  List,
  ListItem,
  useDropdown,
  useOnClickOutside,
  usePopup,
  User,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import icons from '../../../../sources/icons';
import JobsExecutionsPopup from '../executions/JobsExecutionsPopup';
import ProfileService from '../../../../services/ProfileService';

const ExecutionDropdown = ({ executionId, jobName, userInfo }: any) => {
  const buttonRef = useRef(null);
  const { id } = useParams();

  const [isOpenMore, handleToggleMore, handleClickOutside] = useDropdown();
  useOnClickOutside(buttonRef, handleClickOutside);

  const [isOpenLogsPopup, handleTogglePopupForLogs] = usePopup();

  const [dataLog, setDataLog] = useState<any>(null);

  const handleOpenLogs = async () => {
    const data = {
      projectId: +id,
      jobName,
      executionId,
    };
    if (data) {
      setDataLog(data);
      handleTogglePopupForLogs();
      handleClickOutside();
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="space-between"
      justifyContent="center"
      sx={{ position: 'relative' }}
    >
      {isOpenLogsPopup && (
        <JobsExecutionsPopup
          isLog
          isOpenPopup={isOpenLogsPopup}
          handleTogglePopup={handleTogglePopupForLogs}
          item={dataLog}
          projectId={+id}
        />
      )}
      <User
        photo={ProfileService.avatar(userInfo.email)}
        name={userInfo.firstname}
      />
      <Flex
        onClick={() => handleToggleMore()}
        backgroundColor="#FFFFFF"
        justifyContent="center"
        alignItems="center"
        width="34px"
        height="32px"
        sx={{
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'grayShade2',
          boxShadow: 'secondary',
          cursor: 'pointer',
          transition: 'all .25s ease',
          ':hover': {
            borderColor: 'black',
          },
        }}
      >
        {icons.more}
      </Flex>
      {isOpenMore && (
        <Box
          sx={{
            zIndex: 33,
            position: 'absolute',
            right: '-2px',
            top: '69px',
          }}
          ref={buttonRef}
        >
          <List>
            <ListItem onClick={() => console.log(' Spark UI ↗')}>
              Spark UI ↗
            </ListItem>
            <ListItem onClick={() => console.log('RM UI ↗')}>RM UI ↗</ListItem>
            <ListItem onClick={() => console.log('Kbana ↗')}>Kbana ↗</ListItem>
            <ListItem onClick={handleOpenLogs}>Logs</ListItem>
          </List>
        </Box>
      )}
    </Flex>
  );
};

export default ExecutionDropdown;
