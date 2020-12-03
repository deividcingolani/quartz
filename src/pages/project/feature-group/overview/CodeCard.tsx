// eslint-disable-next-line import/no-unresolved
import { CardProps } from '@logicalclocks/quartz/dist/components/card';
import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Card, Text, Code } from '@logicalclocks/quartz';

export interface CodeItem {
  title: string;
  code: string;
}

export interface PipelineHistoryProps
  extends Omit<CardProps, 'content' | 'children'> {
  content: CodeItem[];
}

const CodeCard: FC<PipelineHistoryProps> = ({ content, ...props }) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Card mt="20px" {...props}>
      {content.map(({ title, code }, index) => (
        <Flex
          key={title}
          justifyContent="space-between"
          mt={index ? '20px' : undefined}
        >
          <Text width="80px">{title}</Text>
          <Code width="calc(100% - 80px)" copyButton content={code} />
        </Flex>
      ))}
    </Card>
  );
};

export default CodeCard;
