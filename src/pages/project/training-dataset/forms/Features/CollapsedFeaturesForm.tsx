// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Flex } from 'rebass';
import {
  Badge,
  Button,
  Callout,
  CalloutTypes,
  Collapse,
  Labeling,
  Tooltip,
  Value,
} from '@logicalclocks/quartz';
import icons from '../../../../../sources/icons';
import { FeatureGroupBasket } from '../../../../../services/localStorage/BasketService';
import FeatureGroupsService from '../../../../../services/project/FeatureGroupsService';

export interface CollapsedFeaturesFormProps {
  isDisabled: boolean;
  featureGroups: FeatureGroupBasket[];
  handleDeleteAllFg: (index: number) => () => void;
  handleDelete: (index: number, name: string) => () => void;
  handleOpenStatistics: (index: number, name: string) => () => void;
}

export interface FgCommitCount {
  fgId: number;
  numCommits: number;
}

const CollapsedFeaturesForm: FC<CollapsedFeaturesFormProps> = ({
  handleDelete,
  featureGroups,
  handleDeleteAllFg,
  handleOpenStatistics,
  isDisabled,
}) => {
  // For each feature in the basket, if Hudi, check if they have at least one commit
  const [fgCommits, setFgCommits] = useState<Map<number, number>>();

  const fetchCommits = useCallback(async () => {
    const fgCommitCounts = await Promise.all(
      featureGroups.map(({ fg, projectId }): Promise<FgCommitCount> => {
        return new Promise((resolve) => {
          if (fg.timeTravelFormat === 'HUDI') {
            FeatureGroupsService.getCommitsDetail(
              projectId,
              fg.featurestoreId,
              fg.id,
              1,
            ).then(({ data }) => {
              resolve({
                fgId: fg.id,
                numCommits: data?.count || 0,
              });
            });
          } else {
            resolve({
              fgId: fg.id,
              numCommits: 0,
            });
          }
        });
      }),
    );

    const fgCommits = new Map<number, number>();
    fgCommitCounts.forEach(({ fgId, numCommits }) => {
      fgCommits.set(fgId, numCommits);
    });
    setFgCommits(fgCommits);
  }, [featureGroups]);

  useEffect(() => {
    fetchCommits();
  }, [featureGroups, fetchCommits]);

  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const handleSetIsOpen = () => {
  //  setIsOpen(!isOpen);
  // };

  return (
    <>
      <Flex mt="20px" flexDirection="column">
        {!featureGroups.length && <Value mt="10px">No features selected</Value>}
        {featureGroups.map(({ fg, features }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index}>
            {fg.timeTravelFormat === 'HUDI' && fgCommits?.get(fg.id) === 0 && (
              <Box mb="10px" mt="-10px">
                <Callout
                  content={`${fg.name} does not contain any data, it can't be joined`}
                  type={CalloutTypes.error}
                />
              </Box>
            )}
            <Collapse
              mb="20px"
              key={fg.id}
              title={
                <Flex ml="8px">
                  <Value>{fg.name}</Value>
                  <Value ml="3px" color="labels.orange">
                    #{fg.id}
                  </Value>
                  <Labeling gray ml="3px">
                    version {fg.version}
                  </Labeling>
                </Flex>
              }
              secondaryContent={
                <Labeling gray>{features.length} features</Labeling>
              }
            >
              <Flex mt="5px" flexDirection="column">
                <Flex p="8px" justifyContent="space-between">
                  <Labeling gray>{fg.description || '-'}</Labeling>
                  <Button
                    p={0}
                    intent="inline"
                    color="labels.red"
                    disabled={isDisabled}
                    onClick={handleDeleteAllFg(index)}
                  >
                    remove all features
                  </Button>
                </Flex>
                <Flex mt="5px" flexDirection="column">
                  {features.map(({ name, description, primary, type }) => (
                    <Flex
                      py="15px"
                      px="20px"
                      mx="-20px"
                      alignItems="center"
                      key={`${fg.id}-${name}`}
                      justifyContent="space-between"
                      sx={{
                        borderTopWidth: '1px',
                        borderTopStyle: 'solid',
                        borderTopColor: 'grayShade2',
                      }}
                    >
                      <Flex alignItems="center">
                        <Tooltip ml="8px" mainText="Preview">
                          <Box
                            p="5px"
                            height="28px"
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: '#ffffff',
                              transition: 'all .4s ease',

                              ':hover': {
                                backgroundColor: 'grayShade3',
                              },

                              svg: {
                                width: '20px',
                                height: '20px',
                              },
                            }}
                            onClick={handleOpenStatistics(fg.id, name)}
                          >
                            {icons.eye}
                          </Box>
                        </Tooltip>
                        <Value ml="10px">{name}</Value>
                        <Value ml="20px">{description || '-'}</Value>
                      </Flex>
                      <Flex alignItems="center">
                        {primary && (
                          <Badge
                            mr="20px"
                            height="100%"
                            variant="success"
                            value="primary key"
                          />
                        )}
                        <Badge
                          mr="20px"
                          height="100%"
                          variant="bold"
                          value={type}
                        />
                        <Tooltip mr="8px" mainText="Remove">
                          <Box
                            p="5px"
                            height="28px"
                            sx={{
                              cursor: 'pointer',
                              backgroundColor: '#ffffff',
                              transition: 'all .4s ease',

                              ':hover': {
                                backgroundColor: 'grayShade3',
                              },

                              svg: {
                                width: '20px',
                                height: '20px',
                              },
                            }}
                            onClick={() => {
                              if (!isDisabled) {
                                handleDelete(index, name)();
                              }
                            }}
                          >
                            {icons.cross}
                          </Box>
                        </Tooltip>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Collapse>
          </Box>
        ))}
      </Flex>
    </>
  );
};

export default CollapsedFeaturesForm;
