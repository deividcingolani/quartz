import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  Icon,
  Divider,
  TooltipPositions,
  EditableSelect,
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
  const isSearchEnabled = !(members.error?.response?.data.errorCode === 160057)
  const membersToSelect = members.data? members.data.filter(({ email }) => email !== me) : [];

  return (
    <>
      <Divider legend="Project members" />

      <Controller
        control={control}
        name="membersEmails"
        render={({ onChange, value }) => (
          <>
            {isSearchEnabled? (
              <EditableSelect
                isMulti
                width="100%"
                value={value}
                label="Members"
                type="searchable"
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
                disabled={isLoading || !membersToSelect.length}
                options={membersToSelect.map(({ email }) => email)}
                noDataMessage="No other member registred in this cluster"
              />
            ):(
              <EditableSelect
                width="100%"
                isMulti
                label="Members"
                value={value}
                type="editable"
                labelAction={
                  <Tooltip
                    ml="5px"
                    position={TooltipPositions.right}
                    mainText="You can edit member roles later"
                  >
                    <Icon icon="info-circle" size="sm" />
                  </Tooltip>
                }
                placeholder="enter an email"
                noDataMessage=""
                options={[]}
                onChange={(val) => onChange(val)}
              />
            )}
          </>
        )}
      />
    </>
  );
};

export default memo(MembersForm);
