// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useMemo, useCallback } from 'react';
import { Box, Flex } from 'rebass';
import {
  Badge,
  Button,
  Labeling,
  Select,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';

import { useFormContext } from 'react-hook-form';
import { FeatureGroupJoin } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';

import icons from '../../../../../sources/icons';
import getInputValidation from '../../../../../utils/getInputValidation';

export interface SingleInnerJoinFormProps {
  index: number;
  title?: string;
  isDisabled: boolean;
  join: FeatureGroupJoin;
  options: FeatureGroup[];
  items: FeatureGroupJoin[];
  handleChange: (index: number, field: string, value: any) => void;
}

const InnerJoinForm: FC<SingleInnerJoinFormProps> = ({
  join,
  index,
  title,
  items,
  options,
  handleChange,
  isDisabled,
}) => {
  const { firstFgJoinKeys, secondFgJoinKeys, firstFg, secondFg } = join;

  const { errors } = useFormContext();

  const { joins } = errors;

  const errorJoin = joins && joins.length && joins[index];

  const haveSameName = firstFg?.name === secondFg?.name;

  const handleAddJoinKey = () => {
    handleChange(index, 'firstFgJoinKeys', [...firstFgJoinKeys, []]);
    handleChange(index, 'secondFgJoinKeys', [...secondFgJoinKeys, []]);
  };

  const handleRemoveJoinKey = (nestedIndex: number) => {
    const firstCopy = firstFgJoinKeys.slice();
    const secondCopy = secondFgJoinKeys.slice();

    firstCopy.splice(nestedIndex, 1);
    secondCopy.splice(nestedIndex, 1);

    handleChange(index, 'firstFgJoinKeys', firstCopy);
    handleChange(index, 'secondFgJoinKeys', secondCopy);
  };

  const parseFsName = useCallback(
    (name) => name.replace('_featurestore', ''),
    [],
  );

  const afterJoinOptions = useMemo(() => {
    const slicedArray = items.slice(0, index);

    return slicedArray
      .reduce(
        (acc: { fg: FeatureGroup; name: string }[], { firstFg, secondFg }) => [
          ...acc,
          ...(firstFg?.features.map(({ name }) => ({ name, fg: firstFg })) ||
            []),
          ...(secondFg?.features.map(({ name }) => ({
            name,
            fg: secondFg,
          })) || []),
        ],
        [],
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, index]);

  let delimiterMarginTop;
  // !title ?
  //    errorJoin && (errorJoin.firstFg || errorJoin.secondFg) ? 38 + 25 : 38
  //  : errorJoin && (errorJoin.firstFg || errorJoin.secondFg) ? 50 + 25 : 50;

  if (!title) {
    delimiterMarginTop =
      errorJoin && (errorJoin.firstFg || errorJoin.secondFg) ? 50 + 25 : 50;
  } else {
    delimiterMarginTop =
      errorJoin && (errorJoin.firstFg || errorJoin.secondFg) ? 38 + 25 : 38;
  }

  return (
    <>
      <Box mt="20px" p="8px" backgroundColor="grayShade3">
        {!!title && <Value>{title}</Value>}
        <Flex mt={title ? '8px' : 0} justifyContent="space-between">
          <Box flex={1}>
            {items.length > 1 && !!index && (
              <Box
                p="8px"
                sx={{
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'grayShade2',
                  textAlign: 'center',
                }}
              >
                <Labeling bold gray>
                  performed on the previous inner join
                </Labeling>
              </Box>
            )}
            {!!firstFg && items.length === 1 && (
              <Flex
                p="8px"
                backgroundColor="white"
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
                sx={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'grayShade2',
                }}
              >
                <Value primary>{firstFg.name}</Value>
                {haveSameName && (
                  <Labeling gray bold ml="3px">
                    {parseFsName(firstFg.featurestoreName)}
                  </Labeling>
                )}
              </Flex>
            )}
            {items.length !== 1 && !index && (
              <Select
                width="100%"
                variant="white"
                listWidth="100%"
                deletabled={true}
                disabled={isDisabled}
                hasPlaceholder={false}
                placeholder="pick a feature group"
                value={firstFg ? [firstFg.name] : []}
                options={options
                  .map(({ name }) => name)
                  .sort((a, b) => a.localeCompare(b))}
                onChange={(value) => {
                  if (!value.length) {
                    handleChange(index, 'firstFg', undefined);
                  }
                  const fg = options.find(({ name }) => name === value[0]);

                  if (fg) {
                    handleChange(index, 'firstFg', fg);
                  }
                }}
                {...getInputValidation('firstFg', errorJoin)}
              />
            )}
            {firstFgJoinKeys.map((keys, nestedIndex) => (
              <Select
                mt={`${
                  errorJoin && !errorJoin.firstFg && errorJoin.secondFg
                    ? 20 + 24
                    : 20
                }px`}
                width="100%"
                value={keys}
                variant="white"
                hasSearch={true}
                listWidth="100%"
                maxListHeight="300px"
                disabled={isDisabled}
                hasPlaceholder={false}
                placeholder="pick a join key"
                noDataMessage="pick a join key"
                searchPlaceholder="Find a feature..."
                // eslint-disable-next-line react/no-array-index-key
                key={`first-features-${nestedIndex}-${index}-${keys.length}`}
                additionalTexts={
                  firstFg ? [] : afterJoinOptions.map(({ fg }) => fg?.name)
                }
                additionalComponents={
                  firstFg
                    ? firstFg.features
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(({ primary }) =>
                          primary ? (
                            <Badge value="primary key" variant="success" />
                          ) : null,
                        )
                    : afterJoinOptions.map(({ fg, name }) =>
                        fg?.features.find((feature) => feature.name === name)
                          ?.primary ? (
                          <Badge value="primary key" variant="success" />
                        ) : null,
                      )
                }
                options={
                  firstFg
                    ? firstFg.features
                        .map(({ name }) => name)
                        .sort((a, b) => a.localeCompare(b))
                    : afterJoinOptions.map(({ name }) => name)
                }
                onChange={(value) => {
                  const copy = firstFgJoinKeys.slice();

                  copy[nestedIndex] = value;

                  handleChange(index, 'firstFgJoinKeys', copy);
                }}
                {...getInputValidation(
                  'key',
                  errorJoin &&
                    errorJoin.firstFgJoinKeys &&
                    errorJoin.firstFgJoinKeys[nestedIndex],
                )}
              />
            ))}
            <Button
              mt="8px"
              intent="ghost"
              disabled={isDisabled}
              onClick={handleAddJoinKey}
            >
              Add join key
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center' }} mx="20px" mt="10px">
            {!title && <Value>inner joins</Value>}

            <Box mt={`${delimiterMarginTop}px`}>
              {firstFgJoinKeys.map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Value key={index} mb="37px">
                  {'<->'}
                </Value>
              ))}
            </Box>
          </Box>
          <Box flex={1}>
            {!!secondFg && items.length === 1 && (
              <Flex
                p="8px"
                backgroundColor="white"
                justifyContent="center"
                alignItems="center"
                flexDirection="row"
                sx={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'grayShade2',
                }}
              >
                <Value primary>{secondFg.name}</Value>
                {haveSameName && (
                  <Labeling gray bold ml="3px">
                    {parseFsName(secondFg.featurestoreName)}
                  </Labeling>
                )}
              </Flex>
            )}
            {items.length !== 1 && (
              <Select
                width="100%"
                variant="white"
                listWidth="100%"
                deletabled={true}
                disabled={isDisabled}
                hasPlaceholder={false}
                placeholder="pick a feature group"
                value={secondFg ? [secondFg.name] : []}
                options={options
                  .map(({ name }) => name)
                  .sort((a, b) => a.localeCompare(b))}
                onChange={(value) => {
                  if (!value.length) {
                    handleChange(index, 'secondFg', undefined);
                  }
                  const fg = options.find(({ name }) => name === value[0]);

                  if (fg) {
                    handleChange(index, 'secondFg', fg);
                  }
                }}
                {...getInputValidation('secondFg', errorJoin)}
              />
            )}
            {secondFgJoinKeys.map((keys, nestedIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Flex key={`second-features-${nestedIndex}-${index}`}>
                <Select
                  mt={`${
                    errorJoin && errorJoin.firstFg && !errorJoin.secondFg
                      ? 20 + 24
                      : 20
                  }px`}
                  width="100%"
                  value={keys}
                  variant="white"
                  listWidth="100%"
                  hasSearch={true}
                  disabled={isDisabled}
                  maxListHeight="300px"
                  hasPlaceholder={false}
                  placeholder="pick a join key"
                  noDataMessage="pick a join key"
                  searchPlaceholder="Find a feature..."
                  options={
                    secondFg
                      ? secondFg.features
                          .map(({ name }) => name)
                          .sort((a, b) => a.localeCompare(b))
                      : []
                  }
                  additionalComponents={
                    secondFg
                      ? secondFg.features
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(({ primary }) =>
                            primary ? (
                              <Badge value="primary key" variant="success" />
                            ) : null,
                          )
                      : []
                  }
                  onChange={(value) => {
                    const copy = secondFgJoinKeys.slice();

                    copy[nestedIndex] = value;

                    handleChange(index, 'secondFgJoinKeys', copy);
                  }}
                  {...getInputValidation(
                    'key',
                    errorJoin &&
                      errorJoin.secondFgJoinKeys &&
                      errorJoin.secondFgJoinKeys[nestedIndex],
                  )}
                />

                {secondFgJoinKeys.length > 1 &&
                  (nestedIndex ? (
                    <Tooltip mt="20px" mr="5px" ml="10px" mainText="Remove">
                      <Box
                        p="8px"
                        width="32px"
                        height="32px"
                        onClick={() => {
                          if (!isDisabled) {
                            handleRemoveJoinKey(nestedIndex);
                          }
                        }}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: 'grayShade3',
                          transition: 'all .4s ease',

                          ':hover': {
                            backgroundColor: 'white',
                          },

                          svg: {
                            width: '16px',
                            height: '16px',
                          },
                        }}
                      >
                        {icons.cross}
                      </Box>
                    </Tooltip>
                  ) : (
                    <Box mr="45px" />
                  ))}
              </Flex>
            ))}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default InnerJoinForm;
