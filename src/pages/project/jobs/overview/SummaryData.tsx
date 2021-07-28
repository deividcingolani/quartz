// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { Flex } from 'rebass';
import {
  TextValueBadge,
  User,
  Microlabeling,
  Value,
} from '@logicalclocks/quartz';

// Services
import ProfileService from '../../../../services/ProfileService';

// Components
import DateValue from '../../list/DateValue';
import getAVGtime from '../utils/getAVGtime';

export interface SummaryDataProps {
  data: any;
}

const SummaryData: FC<SummaryDataProps> = ({ data }) => {
  const expectationCount = data.executions.count
    ? data.executions.items.length
    : 0;

  return (
    <>
      <Flex>
        <User
          name={String(data.creator.firstname)}
          isTooltipActive
          photo={ProfileService.avatar(String(data.creator.email))}
        />
        <DateValue
          ml="23px"
          label="Creation"
          date={data?.creationTime ? new Date(data?.creationTime) : new Date()}
        />
        {data?.creationTime && !!data.executions.count ? (
          <DateValue
            ml="20px"
            label="Last run"
            date={new Date(data?.executions.items[0].submissionTime)}
          />
        ) : (
          <Flex ml="20px" flexDirection="column">
            <Microlabeling mb="3px" gray>
              Last run
            </Microlabeling>
            <Value primary>never started</Value>
          </Flex>
        )}
        <Flex ml="20px" flexDirection="column">
          <Microlabeling mb="3px" gray>
            Type
          </Microlabeling>
          <Value primary>{data.jobType}</Value>
        </Flex>
      </Flex>
      <Flex mt="17px" alignItems="center">
        <TextValueBadge
          variant="gray"
          text="executions"
          value={expectationCount}
        />
        {!!data.creationTime && (
          <TextValueBadge
            ml="8px"
            variant="gray"
            text="avg execution time"
            value={
              data.executions.count ? getAVGtime(data.executions.items) : '-'
            }
          />
        )}
      </Flex>
    </>
  );
};

export default memo(SummaryData);
