import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  Icon,
  Select,
  Divider,
  TooltipPositions,
} from '@logicalclocks/quartz';
import { Controller } from 'react-hook-form';

import { RootState } from '../../../store';
import { selectMembers } from '../../../store/models/projects/selectors';

export interface MembersFormProps {
  control: any;
  isLoading: boolean;
}

const MembersForm: FC<MembersFormProps> = ({ control, isLoading }) => {
  const me = useSelector((state: RootState) => state.profile.email);

  const members = useSelector(selectMembers);

  const membersToSelect = members.filter(({ email }) => email !== me);

  return (
    <>
      <Divider legend="Project members" />

      <Controller
        control={control}
        name="membersEmails"
        render={({ onChange, value }) => (
          <Select
            hasPlaceholder={false}
            width="100%"
            value={value}
            isMulti={true}
            label="Members"
            listWidth="100%"
            disabled={isLoading || !membersToSelect.length}
            labelAction={
              <Tooltip
                ml="5px"
                position={TooltipPositions.right}
                mainText="You can edit member roles later"
              >
                <Icon icon="info-circle" size="sm" />
              </Tooltip>
            }
            placeholder="pick members"
            onChange={(val) => onChange(val)}
            noDataMessage="No other member registred in this cluster"
            options={membersToSelect.map(({ email }) => email)}
          />
        )}
      />
    </>
  );
};

export default memo(MembersForm);
