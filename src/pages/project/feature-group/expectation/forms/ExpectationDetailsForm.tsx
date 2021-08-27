// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, FC, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import {
  Row,
  Input,
  Value,
  CardSecondary,
  Microlabeling,
} from '@logicalclocks/quartz';

import icons from '../../../../../sources/icons';
import featureListStyles from './featureListStyles';
import { Expectation } from '../../../../../types/expectation';
import useExpectationFeatureListData from './useExpectationFeatureListData';
import { FeatureGroup } from '../../../../../types/feature-group';
import { rulesMapToShort } from '../types';
import { getShortRuleValue } from '../utilts';

export interface ExpectationDetailsFormProps {
  expectation: Expectation;
  featureGroup: FeatureGroup;
}

const ExpectationDetailsForm: FC<ExpectationDetailsFormProps> = ({
  expectation,
  featureGroup,
}) => {
  const [search, setSearch] = useState<string>();

  const selectedFeatures = useMemo(() => {
    if (!search) {
      return expectation.features;
    }

    return expectation.features.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, expectation]);

  const [groupComponents, groupProps] = useExpectationFeatureListData(
    selectedFeatures,
    featureGroup,
  );

  return (
    <CardSecondary readOnly={true} mt="20px" title="Expectation details">
      <Flex>
        {expectation.rules.map((rule, index) => {
          return (
            <Box key={rule.name} mr="20px">
              <Microlabeling mb="3px" gray>
                Rule #{index + 1}
              </Microlabeling>
              <Flex>
                <Value mr="3px">{rulesMapToShort.getByKey(rule.name)}</Value>
                <Value primary>{getShortRuleValue(rule)}</Value>
              </Flex>
            </Box>
          );
        })}
      </Flex>
      <Flex ml="10px" mt="20px">
        <Box
          mt="10px"
          mr="-24px"
          sx={{
            svg: {
              width: '14px',
              height: '14px',

              path: {
                fill: 'gray',
              },
            },
            zIndex: 1,
          }}
        >
          {icons.glass}
        </Box>
        <Input
          pl="32px"
          width="190px"
          value={search}
          placeholder="Find a feature..."
          onChange={({ target }: any) => setSearch(target.value)}
        />
      </Flex>

      {!!selectedFeatures.length && (
        <Box mt="20px" sx={featureListStyles}>
          <Row
            legend={[
              'name',
              'present in feature group',
              'present in other feature groups',
              'type',
            ]}
            middleColumn={2}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      )}
    </CardSecondary>
  );
};

export default ExpectationDetailsForm;
