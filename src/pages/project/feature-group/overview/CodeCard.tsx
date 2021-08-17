// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Card, Code, Value, CardProps } from '@logicalclocks/quartz';

export interface CodeItem {
  title: string;
  code: string;
  language: string;
}

export interface PipelineHistoryProps
  extends Omit<CardProps, 'content' | 'children'> {
  content: CodeItem[];
  hasTitle?: boolean;
}

const CodeCard: FC<PipelineHistoryProps> = ({
  content,
  hasTitle = true,
  ...props
}) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Card mt="20px" {...props}>
      {content.map(({ title, code, language }, index) => (
        <Flex
          key={title}
          justifyContent="space-between"
          mt={index ? '20px' : undefined}
        >
          <Flex width="100%">
            <Value maxWidth="120px" minWidth="120px">
              {title}
            </Value>
            <Box width="100%" m="-20px">
              <Code
                isColorSyntax={true}
                copyButton
                content={code}
                language={language}
              />
            </Box>
          </Flex>
        </Flex>
      ))}
    </Card>
  );
};

export default CodeCard;
