import { Box } from 'rebass';
import { format } from 'date-fns';
import { Tooltip, TooltipPositions } from '@logicalclocks/quartz';

// Items
import React, { FC, useEffect } from 'react';
import Creation from './items/Creation';
import JobExecution from './items/JobExecution';
import DataIngestion from './items/DataIngestion';
import NewStatistics from './items/NewStatistics';
import DataValidation from './items/DataValidation';
// Types
import { ActivityItemData, ActivityType } from '../../types/feature-group';

export interface ActivityItemProps {
  activities: ActivityItemData[];
  actions?: Map<ActivityType, () => void>;
}

export const dateFormat = 'y-MM-dd hh:mm:ss';

export const shortDateFormat = 'MM.dd.y hh:mm';

export const getForm = (
  type: ActivityType,
): FC<{
  activity: ActivityItemData;
  onButtonClick?: (data?: any) => void;
}> | null => {
  const forms = new Map<
    ActivityType,
    FC<{ activity: ActivityItemData; onButtonClick?: (data?: any) => void }>
  >([
    [ActivityType.commit, DataIngestion],
    [ActivityType.job, JobExecution],
    [ActivityType.metadata, Creation],
    [ActivityType.statistics, NewStatistics],
    [ActivityType.validations, DataValidation],
  ]);

  const form = forms.get(type);

  if (form) {
    return form;
  }

  return null;
};

const ActivityDataItem: FC<ActivityItemProps> = ({ activities, actions }) => {
  useEffect(() => {
    const sortPriority = ['METADATA', 'JOB', 'STATISTICS', 'COMMIT'];
    activities.sort(function (x, y) {
      return sortPriority.indexOf(y.type) - sortPriority.indexOf(x.type);
    });
  }, [activities]);

  return (
    <Box mb="20px">
      {activities.map((activity, index) => {
        const hasNext = index !== activities.length - 1;
        const Form = getForm(activity.type);

        return (
          <Tooltip
            position={TooltipPositions.left}
            key={`${activity.timestamp}-${index}`}
            mainText={format(activity.timestamp, dateFormat)}
          >
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grayShade2',
                borderBottom: hasNext ? 'none' : '',
              }}
            >
              {!!Form && (
                <Form
                  activity={activity}
                  onButtonClick={actions?.get(activity.type)}
                />
              )}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default ActivityDataItem;
