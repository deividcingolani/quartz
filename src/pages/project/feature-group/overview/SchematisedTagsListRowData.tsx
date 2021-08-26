// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { ComponentType, useCallback, useEffect, useState } from 'react';
import {
  Value,
  Labeling,
  Button,
  Input,
  NotificationsManager,
} from '@logicalclocks/quartz';

// Types
import { Box, Flex } from 'rebass';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getNormalizedValue } from '../utils';
import FeatureGroupsService from '../../../../services/project/FeatureGroupsService';
import { RootState } from '../../../../store';
import NotificationBadge from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';
import TrainingDatasetService from '../../../../services/project/TrainingDatasetService';
import useGetHrefForRoute from '../../../../hooks/useGetHrefForRoute';
import getInputValidation from '../../../../utils/getInputValidation';
import { Tag } from '../../../../types';
import tagsListStyles from './tags-list-styles';
import routeNames from '../../../../routes/routeNames';

const SchematisedTagsListRowData = ({
  tag,
  index,
  type,
}: {
  tag: Tag;
  index: number;
  type: string;
}) => {
  const { [`${type} Id`]: id } = useParams();

  const methods = useForm();

  const { errors, register, setError, clearErrors, handleSubmit } = methods;

  const [isQuicklyEditable, setIsQuicklyEditable] = useState(false);

  const getHref = useGetHrefForRoute();

  const { id: projectId } = useParams();
  const featureStoreId = useSelector((state: RootState) => {
    if (!!state && !!state.featureStores) {
      return state.featureStores[0].featurestoreId;
    }
    return false;
  });
  const featureGroupId = useSelector((state: RootState) => {
    if (!!state && !!state.featureGroupView) {
      return state.featureGroupView.id;
    }
    return false;
  });

  const trainingDatasetId = useSelector((state: RootState) => {
    if (!!state && !!state.trainingDatasetView) {
      return state.trainingDatasetView.id;
    }
    return false;
  });

  const [tagData, setTagData] = useState(tag);

  const handleSaveTags = async (data: any) => {
    const checkTypes = Object.values(tagData.types).map((el: string) =>
      el.includes('Array'),
    );
    let res;
    try {
      if (!!featureStoreId && !!data && !checkTypes[0]) {
        Object.keys(data).forEach(function (item) {
          getNormalizedValue(data[item]);
        });
        if (type === ItemDrawerTypes.fg && featureGroupId) {
          res = await FeatureGroupsService.attachTag(
            +projectId,
            featureStoreId,
            featureGroupId,
            tagData.name,
            data,
          );
        } else if (type === ItemDrawerTypes.td && !!trainingDatasetId) {
          res = await TrainingDatasetService.attachTag(
            +projectId,
            featureStoreId,
            trainingDatasetId,
            tagData.name,
            data,
          );
        }
        if (!!res && res.status === 200) {
          setIsQuicklyEditable(false);
          NotificationsManager.create({
            isError: false,
            type: <NotificationBadge message="Success" variant="success" />,
            content: <NotificationContent message="Tag edited" />,
          });
          setTagData({
            name: tagData.name,
            tags: data,
            types: tagData.types,
          });
        }
      } else if (!!featureStoreId && !!data && checkTypes[0]) {
        Object.keys(data).forEach(function (item) {
          // eslint-disable-next-line no-param-reassign
          data[item] = data[item]
            .split(',')
            .map((el: any) => getNormalizedValue(el));
        });
        if (type === ItemDrawerTypes.fg && featureGroupId) {
          res = await FeatureGroupsService.attachTag(
            +projectId,
            featureStoreId,
            featureGroupId,
            tagData.name,
            data,
          );
        } else if (type === ItemDrawerTypes.td && !!trainingDatasetId) {
          res = await TrainingDatasetService.attachTag(
            +projectId,
            featureStoreId,
            trainingDatasetId,
            tagData.name,
            data,
          );
        }
        if (!!res && res.status === 200) {
          setIsQuicklyEditable(false);
          NotificationsManager.create({
            isError: false,
            type: <NotificationBadge message="Success" variant="success" />,
            content: <NotificationContent message="Tag edited" />,
          });
          setTagData({
            name: tagData.name,
            tags: data,
            types: tagData.types,
          });
        }
      }
    } catch (err) {
      NotificationsManager.create({
        isError: true,
        type: <NotificationBadge message="Fail" variant="fail" />,
        content: <NotificationContent message={err.response.data.errorMsg} />,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit(async (data: any) => {
      handleSaveTags(data);
    }),
    [setError, clearErrors],
  );

  useEffect(() => undefined, [tagData]);

  const groupType = type === 'fg' ? 'featureGroup' : 'trainingDataset';

  console.log(tagData);

  return (
    <Flex flexDirection="column" key={index}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        sx={tagsListStyles}
      >
        <Value>{tagData.name}</Value>
        <Button
          p={0}
          href={getHref(
            routeNames[groupType].edit.replace(`:${type}Id`, String(+id)),
            routeNames.project.view,
          )}
          intent="inline"
          onClick={() => setIsQuicklyEditable(true)}
        >
          edit properties
        </Button>
      </Flex>

      <Box as="table" sx={{ borderCollapse: 'collapse' }}>
        {Object.entries(tagData?.tags || []).map(([key, value]) => {
          // const inputType = tagData.types[key];
          return (
            <Box
              as="tr"
              key={key}
              sx={{
                py: '12px',
                pl: '20px',
                alignItems: 'center',
                borderBottomWidth: '1px',
                borderBottomColor: 'grayShade2',
                borderBottomStyle: 'solid',
                width: '100%',
                display: 'table-row',
              }}
            >
              <Box as="td" p="12px">
                <Labeling gray mr="20px">
                  {key}
                </Labeling>
              </Box>
              {!isQuicklyEditable ? (
                <Value as="td" width="100%">
                  {Array.isArray(value)
                    ? value.join(', ').toString()
                    : value.toString()}
                </Value>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    '>label': {
                      mb: '0px',
                      width: '100%',
                    },
                  }}
                  as="td"
                >
                  {Array.isArray(value) ? (
                    <Input
                      mb="0px"
                      name={key}
                      ref={register}
                      defaultValue={value}
                      placeholder="enter the value"
                      label=""
                      labelProps={{ width: '180%', mb: '20px' }}
                      {...getInputValidation(key, errors)}
                    />
                  ) : (
                    <Input
                      mb="0px"
                      name={key}
                      ref={register}
                      defaultValue={value}
                      placeholder="enter the value"
                      label=""
                      labelProps={{ width: '180%', mb: '20px' }}
                      {...getInputValidation(key, errors)}
                    />
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {isQuicklyEditable && (
        <Flex justifyContent="flex-end">
          <Button
            mt="20px"
            mr="20px"
            intent="secondary"
            onClick={() => setIsQuicklyEditable(false)}
          >
            Cancel
          </Button>
          <Button mt="20px" onClick={onSubmit}>
            Save
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default SchematisedTagsListRowData;
