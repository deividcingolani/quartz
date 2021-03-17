import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { FC, useCallback, useMemo } from 'react';
import { Button, DatePicker, Select } from '@logicalclocks/quartz';

// Components
import Panel from '../../../../components/panel/Panel';
import Loader from '../../../../components/loader/Loader';
import Activity from '../../../../components/activity/Activity';
import FilterResult from '../../../../components/filter-result/FilterResult';
// Types
import {
  ActivityTypeSortOptions,
  TrainingDatasetActivityContentProps,
} from './types';
import { ActivityType } from '../../../../types/feature-group';
// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Selectors
import {
  selectTrainingDatasetActivityLoadingFollowing,
  selectTrainingDatasetActivityLoadingMore,
  selectTrainingDatasetActivityLoadingPrevious,
} from '../../../../store/models/training-dataset/activity/selectors';
// Utils
import { getDatePickerTime } from '../../feature-group/utils';

import routeNames from '../../../../routes/routeNames';

const TrainingDatasetActivityContent: FC<TrainingDatasetActivityContentProps> = ({
  view,
  event,
  hasData,
  endDate,
  setEvent,
  activity,
  loaderRef,
  startDate,
  isLoading,
  setEndDate,
  creationDate,
  setStartDate,
  onResetFilters,
  defaultToDate,
  defaultFromDate,
  handleDateChange,
  handleRefreshData,
  handleLoadPreviousData,
  handleLoadFollowingData,
}) => {
  const { tdId } = useParams();

  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route.replace(':tdId', tdId), routeNames.project.view);
    },
    [tdId, navigate],
  );

  const actions = useMemo(
    () =>
      new Map([
        [
          ActivityType.statistics,
          (commitTime: number) =>
            handleNavigate(`/td/:tdId/statistics/commit/${commitTime}`)(),
        ],
      ]),
    [handleNavigate],
  );

  const isLoadingPreviousData = useSelector(
    selectTrainingDatasetActivityLoadingPrevious,
  );
  const isLoadingFollowingData = useSelector(
    selectTrainingDatasetActivityLoadingFollowing,
  );
  const isLoadingMore = useSelector(selectTrainingDatasetActivityLoadingMore);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 115px)',
      }}
    >
      <Panel
        id={view?.id}
        title={view?.name}
        idColor="labels.orange"
        onClickRefresh={handleRefreshData}
        onClickEdit={handleNavigate(routeNames.featureGroup.edit)}
      />

      <Flex justifyContent="space-between" mt="65px">
        <Select
          width="auto"
          value={[event]}
          variant="white"
          height="fit-content"
          placeholder="events"
          maxListHeight="fit-content"
          options={Object.values(ActivityTypeSortOptions)}
          onChange={(value) => setEvent(value[0] as ActivityTypeSortOptions)}
        />

        <Flex>
          <Box mr="20px">
            <DatePicker
              showTimeSelect={true}
              dateFormat="MMMM d, yyyy h:mm aa"
              selectProps={{
                options: [],
                placeholder: '',
                width: 'auto',
                variant: 'white',
                onChange: () => {},
                noDataMessage: 'from',
                value: [
                  getDatePickerTime(startDate, true, {
                    fromDate: defaultFromDate,
                  }),
                ],
              }}
              selected={startDate}
              onChange={(date) => {
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
              disabledKeyboardNavigation={true}
              maxDate={new Date(Math.min(+new Date(), +endDate))}
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
              onChange: () => {},
              noDataMessage: 'to',
              value: [
                getDatePickerTime(endDate, false, { toDate: defaultToDate }),
              ],
            }}
            selected={endDate}
            minDate={startDate}
            maxDate={new Date()}
            disabledKeyboardNavigation={true}
            onChange={(date) => {
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

      {isLoading && <Loader />}

      {!isLoading && (
        <Box mt="20px">
          <Box pb="20px">
            {!!Object.keys(activity).length && (
              <>
                {isLoadingFollowingData && (
                  <Loader
                    sx={{
                      ml: '5%',
                      mb: '20px',
                      mt: '20px',
                      width: '100px',
                      position: 'relative !important',
                    }}
                  />
                )}
                {hasData.hasFollowing && !isLoadingFollowingData && (
                  <Button
                    ml="110px"
                    mb="20px"
                    intent="ghost"
                    onClick={handleLoadFollowingData}
                  >
                    display following events
                  </Button>
                )}
                <Activity
                  hasData={hasData}
                  actions={actions}
                  items={activity}
                />
                <Box ref={loaderRef} />
                {hasData.hasPrevious &&
                  !hasData.hasMore &&
                  !isLoadingPreviousData && (
                    <Button
                      mb="20px"
                      ml="110px"
                      intent="ghost"
                      onClick={handleLoadPreviousData}
                    >
                      display previous events
                    </Button>
                  )}
                {(isLoadingPreviousData || isLoadingMore) && (
                  <Loader
                    sx={{
                      ml: '5%',
                      mt: '30px',
                      mb: '10px',
                      width: '100px',
                      position: 'relative !important',
                    }}
                  />
                )}
              </>
            )}
            {!Object.keys(activity).length && (
              <Box mt="300px">
                <FilterResult
                  subject="activities"
                  result={0}
                  onReset={onResetFilters}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TrainingDatasetActivityContent;
