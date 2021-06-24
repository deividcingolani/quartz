// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Button, DatePicker, Select, usePopup } from '@logicalclocks/quartz';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { JobsExecutionContentProps, ExecutionsTypeSortOptions } from './types';
import Panel from '../../../../components/panel/Panel';
import { RootState } from '../../../../store';
import Executions from '../../../../components/executions/Executions';
import getDatePickerTime from '../utils/getDatepickerTime';
import JobsExecutionsPopup from './JobsExecutionsPopup';
import NoData from '../../../../components/no-data/NoData';
import { JobsViewExecutions } from '../../../../store/models/jobs/executions/jobsExecutions.model';

const JobsExecutionsContent: FC<JobsExecutionContentProps> = ({
  data,
  handleEdit,
  handleRefreshData,
  handleDateChange,
  setEvent,
  event,
  endDate,
  defaultFromDate,
  defaultToDate,
  startDate,
  setEndDate,
  setStartDate,
  creationDate,
  isLoading,
  loadPrimaryExecutionsData,
}) => {
  const executions = useSelector((state: RootState) => state.jobsExecutions);
  const batchSize = 10;
  const [hasData, setHasData] = useState({
    hasMore: false,
    hasPrevious: false,
    hasFollowing: false,
  });

  useEffect(() => {
    if (executions && !isLoading) {
      const executionsLength = JSON.parse(JSON.stringify(executions));
      const test = Object.keys(executionsLength)[0];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const count = executions[test].length;
      if (count < batchSize) {
        setHasData((prevState) => ({
          ...prevState,
          hasMore: false,
          hasFollowing: true,
          hasPrevious: true,
        }));
      } else {
        setHasData((prevState) => ({
          ...prevState,
          hasMore: true,
          hasFollowing: true,
          hasPrevious: true,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executions]);

  const navigate = useNavigate();

  const executionData = useSelector<RootState, JobsViewExecutions>(
    (state: RootState) => state.jobsExecutions,
  );

  const resetFilter = () => {
    setEvent(ExecutionsTypeSortOptions.ALL);
    const resetData = executionData && Object.keys(executionData).pop();
    if (resetData) setStartDate(new Date(resetData));
    loadPrimaryExecutionsData();
    navigate('/p/119/jobs/38/executions');
  };

  const [isOpenPopupForLogs, handleTogglePopupForLogs] = usePopup();
  const [dataLog, setDataLog] = useState(null);

  return (
    <>
      <Flex
        sx={{
          flexDirection: 'column',
        }}
      >
        {data && !isLoading && (
          <>
            <Panel
              data={data}
              title={String(data?.name)}
              id={data.id}
              hasVersionDropdown
              idColor="gray"
              onClickEdit={handleEdit}
              onClickRefresh={handleRefreshData}
            />
            <JobsExecutionsPopup
              isLog
              projectId={+data.id}
              item={dataLog}
              isOpenPopup={isOpenPopupForLogs}
              handleTogglePopup={handleTogglePopupForLogs}
            />
          </>
        )}
        <Flex justifyContent="space-between" mt="65px">
          <Select
            width="auto"
            value={[event]}
            defaultValue={ExecutionsTypeSortOptions.ALL}
            variant="white"
            height="fit-content"
            placeholder="state"
            maxListHeight="fit-content"
            options={Object.values(ExecutionsTypeSortOptions)}
            onChange={(value) =>
              setEvent(value[0] as ExecutionsTypeSortOptions)
            }
          />
          <Flex>
            <Box mr="20px">
              <DatePicker
                showTimeSelect={true}
                dateFormat="dd.mm.yyyy"
                selectProps={{
                  options: [],
                  placeholder: '',
                  width: 'auto',
                  variant: 'white',
                  onChange: () => {
                    // Do nothing
                  },
                  noDataMessage: 'from',
                  value: [
                    getDatePickerTime(startDate as Date, true, {
                      fromDate: defaultFromDate,
                    }),
                  ],
                }}
                selected={startDate}
                onChange={(date: Date) => {
                  const withHours = date as Date;
                  if (withHours.getSeconds() !== 0) {
                    withHours.setHours(0);
                    withHours.setMinutes(0);
                    withHours.setSeconds(0);
                  }
                  setStartDate(date as Date);
                  handleDateChange({
                    newStartDate: date as Date,
                    newEndDate: endDate,
                  });
                }}
                minDate={new Date(creationDate)}
                maxDate={new Date()}
                disabledKeyboardNavigation={true}
              />
            </Box>
            <DatePicker
              showTimeSelect={true}
              dateFormat="MMMM d, yyyy h:mm aa"
              selectProps={{
                options: [],
                placeholder: '',
                width: 'auto',
                variant: 'white',
                onChange: () => {
                  // Do nothing
                },
                noDataMessage: 'to',
                value: [
                  getDatePickerTime(endDate as Date, false, {
                    toDate: defaultToDate,
                  }),
                ],
              }}
              selected={endDate}
              minDate={startDate}
              maxDate={new Date()}
              disabledKeyboardNavigation={true}
              onChange={(date: Date) => {
                const withHours = date as Date;

                if (withHours.getSeconds() !== 0) {
                  withHours.setHours(23);
                  withHours.setMinutes(30);
                  withHours.setSeconds(0);
                }

                setEndDate(withHours);
                handleDateChange({
                  newEndDate: withHours,
                  newStartDate: startDate,
                });
              }}
            />
          </Flex>
        </Flex>
        <Flex width="100%">
          {executions && data && !isLoading && (
            <Executions
              items={executions}
              hasData={hasData}
              selectedJobName={data.name}
              handleTogglePopupForLogs={handleTogglePopupForLogs}
              setDataLog={setDataLog}
              isLoading={isLoading}
            />
          )}
        </Flex>
      </Flex>
      {executions === null && (
        <Box mt="270px">
          <NoData
            isFilter
            mainText="No executions match with filters"
            secondaryText="Change or reset filters"
          >
            <Button intent="primary" onClick={resetFilter}>
              Reset filters
            </Button>
          </NoData>
        </Box>
      )}
    </>
  );
};

export default JobsExecutionsContent;
