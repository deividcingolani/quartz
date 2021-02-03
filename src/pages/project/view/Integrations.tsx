import {
  Card,
  Value,
  Button,
  Callout,
  CalloutTypes,
} from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import React, { FC } from 'react';
import useNavigateRelative from '../../../hooks/useNavigateRelative';

const Integrations: FC = () => {
  const navigate = useNavigateRelative();

  return (
    <Card
      mb="20px"
      mt="20px"
      title="Integrations"
      actions={
        <Button
          onClick={() =>
            window.open(
              'https://hopsworks.readthedocs.io/en/latest/admin_guide/user-administration.html',
              '_blank',
            )
          }
          mr="-10px"
          intent="inline"
        >
          add members
        </Button>
      }
    >
      <Box>
        <Callout
          content={
            <Flex alignItems="center">
              <Value>
                Hopsworks let you manage integrations with Databricks and Spark.
                More info in
              </Value>
              <Button
                ml="-10px"
                height="20px"
                pt="3px"
                sx={{
                  fontFamily: 'Inter',
                }}
                fontWeight="bold"
                intent="inline"
                onClick={() =>
                  window.open('https://docs.hopsworks.ai/setup', '_blank')
                }
              >
                the documentation↗
              </Button>
            </Flex>
          }
          type={CalloutTypes.neutral}
        />

        <Flex mt="20px">
          <Button
            onClick={() => navigate('/integrations/databricks', 'p/:id/*')}
            intent="secondary"
          >
            Databricks
          </Button>
          <Button
            onClick={() => navigate('/integrations/spark', 'p/:id/*')}
            intent="secondary"
            ml="20px"
          >
            Spark
          </Button>
          <Button
            onClick={() => navigate('/integrations/code', 'p/:id/*')}
            ml="20px"
            intent="ghost"
          >
            Code integration
          </Button>
        </Flex>
      </Box>
    </Card>
  );
};

export default Integrations;
