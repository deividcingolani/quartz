// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, useEffect, useState } from 'react';
import { Box } from 'rebass';
import { useParams } from 'react-router-dom';
import { Labeling, Row, Select } from '@logicalclocks/quartz';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../../../store';
import { Expectation } from '../../../../../../types/expectation';

import {
  selectValidators,
  selectValidatorsLoading,
} from '../../../../../../store/models/validators/validators.selectors';
import useActivityListRowData from './useActivityListRowData';
import Loader from '../../../../../../components/loader/Loader';
import activityListStyles from './activityListStyles';

export interface ActivityProps {
  id: number;
  expectation: Expectation;
}

const Activity: FC<ActivityProps> = ({ id, expectation }) => {
  const { id: projectId, fsId } = useParams();

  const [selected, setSelected] = useState<number>(id);

  const isLoading = useSelector(selectValidatorsLoading);

  const activity = useSelector(selectValidators);

  const [components, props] = useActivityListRowData(activity);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.validators.fetch({
      projectId: +projectId,
      featureGroupId: selected,
      featureStoreId: +fsId,
    });
  }, [dispatch, fsId, projectId, selected]);

  const handleFGChange = (values: string[]) => {
    const toSelect = expectation.attachedFeatureGroups?.find(
      ({ name }) => name === values[0],
    )?.id;

    if (toSelect) {
      setSelected(toSelect);
    }
  };

  if (isLoading) {
    return (
      <Box width="100%" height="55px" sx={{ position: 'relative' }}>
        <Loader />
      </Box>
    );
  }

  return (
    <Box width="100%">
      <Select
        width="100%"
        listWidth="100%"
        onChange={handleFGChange}
        placeholder="feature group"
        value={[
          expectation.attachedFeatureGroups?.find(({ id }) => selected === id)
            ?.name || '',
        ]}
        options={
          expectation.attachedFeatureGroups?.map(({ name }) => name) || []
        }
      />

      {activity.length ? (
        <Box mt="20px" width="100%" sx={activityListStyles}>
          <Row
            middleColumn={1}
            groupComponents={components as ComponentType<any>[][]}
            groupProps={props}
          />
        </Box>
      ) : (
        <Box
          mt="20px"
          sx={{
            textAlign: 'center',
          }}
        >
          <Labeling bold gray>
            No activity
          </Labeling>
        </Box>
      )}
    </Box>
  );
};

export default Activity;
