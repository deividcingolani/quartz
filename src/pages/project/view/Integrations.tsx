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
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';

const Integrations: FC = () => {
  const navigate = useNavigateRelative();

  const getHref = useGetHrefForRoute();

  return (
    <>
      <Card mt="20px" title="Integrations">
        <Box>
          <Callout
            content={
              <Flex alignItems="center">
                <Value>
                  Hopsworks lets you manage integrations with Databricks and
                  Spark. More info in
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
              href={getHref('/integrations/databricks', 'p/:id/*')}
              intent="secondary"
            >
              Databricks
            </Button>
            <Button
              onClick={() => navigate('/integrations/spark', 'p/:id/*')}
              intent="secondary"
              href={getHref('/integrations/spark', 'p/:id/*')}
              ml="20px"
            >
              Spark
            </Button>
            <Button
              href={getHref('/integrations/code', 'p/:id/*')}
              onClick={() => navigate('/integrations/code', 'p/:id/*')}
              ml="20px"
              intent="secondary"
            >
              Connect with Python
            </Button>
          </Flex>
        </Box>
      </Card>
      <Box
        sx={{
          height: '20px',
          width: '100%',
          backgroundColor: '#F5F5F5',
          opacity: 0,
        }}
      >
        invisible block margin
      </Box>
    </>
  );
};

export default Integrations;
