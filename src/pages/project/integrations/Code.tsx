import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Button, Card, Code, Value } from '@logicalclocks/quartz';

import useTitle from '../../../hooks/useTitle';
import titles from '../../../sources/titles';

const apiCode = {
  title: 'Configuration',
  language: 'python',
  content: `import hsfs
conn = hsfs.connection(
    'my_instance',                      # DNS of your Feature Store instance
    443,                                # Port to reach your Hopsworks instance, defaults to 443
    'my_project',                       # Name of your Hopsworks Feature Store project
    secrets_store='secretsmanager',     # Either parameterstore or secretsmanager
    hostname_verification=True         # Disable for self-signed certificates
)
fs = conn.get_feature_store()           # Get the project's default feature store"`,
};

const ProjectCode: FC = () => {
  useTitle(titles.code);

  return (
    <Card
      mb="40px"
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
      <Flex>
        <Value maxWidth="150px">Connect to Feature Store</Value>
        <Box width="100%" m="-20px">
          <Code copyButton={true} {...apiCode} isColorSyntax={true} />
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCode;
