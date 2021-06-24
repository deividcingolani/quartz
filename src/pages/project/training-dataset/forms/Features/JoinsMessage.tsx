import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Labeling, Value } from '@logicalclocks/quartz';

import { FeatureGroupJoin } from '../../types';

export interface JoinsMessageProps {
  joins: FeatureGroupJoin[];
}

const JoinsMessage: FC<JoinsMessageProps> = ({ joins }) => {
  return (
    <Flex
      p="8px"
      mt="20px"
      flexWrap="wrap"
      sx={{
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'grayShade2',
      }}
    >
      {joins.map(({ id, firstFg, secondFg }, index) => (
        <React.Fragment key={id}>
          {!index &&
            new Array(joins.length - index - 1)
              .fill(0)
              .map((_, nestedIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <Value key={`first-fg-${index}-${nestedIndex}`} mr="3px">
                  (
                </Value>
              ))}
          {!index &&
            (firstFg ? (
              <Value primary mr="3px">
                {firstFg.name}
              </Value>
            ) : (
              <Labeling mr="3px" gray bold>
                feature group
              </Labeling>
            ))}
          <Value mr="3px"> {'<-->'}</Value>
          {secondFg ? (
            <Value primary mr="3px">
              {secondFg.name}
            </Value>
          ) : (
            <Labeling mr="3px" gray bold>
              feature group
            </Labeling>
          )}
          {index !== joins.length - 1 &&
            new Array(index + 1).fill(0).map((_, nestedIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Value key={`second-fg-${index}-${nestedIndex}`} mr="3px">
                )
              </Value>
            ))}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default JoinsMessage;
