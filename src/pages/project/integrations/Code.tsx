import React, { FC } from 'react';
import { Flex, Text, TextProps } from 'rebass';
import { Button, Card, Code, Value } from '@logicalclocks/quartz';

import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';

interface CodeTextProps extends Omit<TextProps, 'css'> {}

const CodeText: FC<CodeTextProps> = ({ children, ...rest }) => {
  return (
    <Text
      fontSize="12px"
      lineHeight="16px"
      fontFamily="IBM Plex Mono"
      {...rest}
    >
      {children}
    </Text>
  );
};

const ProjectCode: FC = () => {
  useTitle(titles.code);

  return (
    <Card
      mt="20px"
      title="Connect to Feature Store"
      actions={
        <Button
          onClick={() =>
            window.open(
              'https://docs.hopsworks.ai/generated/project/#connection',
              '_blank',
            )
          }
          p={0}
          intent="inline"
        >
          documentation↗
        </Button>
      }
    >
      <Flex width="100%" flexDirection="column">
        <Flex>
          <Value mr="20px">Connect to the Feature Store</Value>
          <Code
            copyButton={true}
            element={
              <Flex flexDirection="column" width="90%">
                <CodeText>import hsfs</CodeText>
                <CodeText>conn = hsfs.connection(</CodeText>
                <Flex>
                  <CodeText ml="30px">'my_instance',</CodeText>
                  <CodeText ml="160px">
                    # DNS of your Feature Store instance
                  </CodeText>
                </Flex>
                <Flex>
                  <CodeText ml="30px">443</CodeText>
                  <CodeText ml="239px">
                    # Port to reach your Hopsworks instance, defaults to 443
                  </CodeText>
                </Flex>
                <Flex>
                  <CodeText ml="30px">'my_project',</CodeText>
                  <CodeText ml="167px">
                    # Name of your Hopsworks Feature Store project
                  </CodeText>
                </Flex>
                <Flex>
                  <CodeText ml="30px">secrets_store='secretsmanager',</CodeText>
                  <CodeText ml="160px">
                    # Either parameterstore or secretsmanager
                  </CodeText>
                </Flex>
                <Flex>
                  <CodeText ml="30px">hostname_verification=True</CodeText>
                  <CodeText ml="73px">
                    # Disable for self-signed certificates
                  </CodeText>
                </Flex>
                <CodeText>)</CodeText>
                <Flex>
                  <CodeText>fs = conn.get_feature_store()</CodeText>
                  <CodeText ml="82px">
                    # Get the project's default feature store
                  </CodeText>
                </Flex>
              </Flex>
            }
            content="import hsfs
conn = hsfs.connection(
    'my_instance',                      # DNS of your Feature Store instance
    443,                                # Port to reach your Hopsworks instance, defaults to 443
    'my_project',                       # Name of your Hopsworks Feature Store project
    secrets_store='secretsmanager',     # Either parameterstore or secretsmanager
    hostname_verification=True         # Disable for self-signed certificates
)
fs = conn.get_feature_store()           # Get the project's default feature store"
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProjectCode;
