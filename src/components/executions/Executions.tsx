// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { Dispatch, FC, SetStateAction } from 'react';
import { Flex } from 'rebass';
import ExecutionsDataItem from './ExecutionsItem';
import ExecutionsTimeline from './ExecutionsTimeline';
import { JobExecutions } from '../../types/jobs';

export interface ExecutionsProps {
  items: JobExecutions;
  hasData: {
    hasPrevious: boolean;
    hasFollowing: boolean;
  };
  selectedJobName: string;
  handleTogglePopupForLogs?: any;
  setDataLog?: Dispatch<SetStateAction<any>>;
  isLoading: boolean;
}

const Executions: FC<ExecutionsProps> = ({
  isLoading,
  items,
  hasData,
  selectedJobName,
  handleTogglePopupForLogs,
  setDataLog,
}) => {
  return (
    <>
      {!isLoading && (
        <Flex width="100%">
          <ExecutionsTimeline items={items} hasData={hasData} />

          <Flex flex={1} flexDirection="column">
            {Object.entries(items).map(([key, value]) => {
              return (
                <ExecutionsDataItem
                  handleTogglePopupForLogs={handleTogglePopupForLogs}
                  executionsList={value}
                  key={`item-${key}`}
                  selectedJobName={selectedJobName}
                  setDataLog={setDataLog}
                />
              );
            })}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Executions;
