import { Box, Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Callout,
  CalloutTypes,
  Value,
  Labeling,
} from '@logicalclocks/quartz';

// Types
import { FeatureFormProps } from '../types';
import { SchematisedTagEntity } from '../../../../types/feature-group';
// Components
import SingleTag from './SingleTag';
// Selectors
import {
  selectSchematisedTagListLoading,
  selectSchematisedTags,
} from '../../../../store/models/schematised-tags/schematised-tags.selectors';
// Utils
import { randomArrayString } from '../../../../utils';

import routeNames from '../../../../routes/routeNames';
import { schematisedTagAddEvent } from '../../../../store/models/localManagement/store.model';
import { Dispatch, RootState } from '../../../../store';
import { FeatureGroupViewState } from '../../../../store/models/feature/featureGroupView.model';
import { ItemDrawerTypes } from '../../../../components/drawer/ItemDrawer';

export interface ListItem {
  id: string;
  selected: string[];
  tag?: SchematisedTagEntity;
}

const SchematisedTags: FC<FeatureFormProps> = ({
  isDisabled,
  type = ItemDrawerTypes.fg,
}) => {
  const tags = useSelector(selectSchematisedTags).sort((tagA, tagB) =>
    tagA.name.localeCompare(tagB.name),
  );

  const dispatch = useDispatch<Dispatch>();

  const isLoading = useSelector(selectSchematisedTagListLoading);

  const isLoadingServerTagsFG = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

  const isLoadingServerTagsTD = useSelector(
    (state: RootState) =>
      state.loading.effects.trainingDatasetView.loadRemainingData,
  );

  const { getValues, setValue } = useFormContext();

  const baseOptions = useMemo(() => {
    return tags.map(({ name, description }) =>
      description ? `${name} - ${description}` : name,
    );
  }, [tags]);

  const [listTags, setList] = useState<ListItem[]>([
    { id: randomArrayString(10)[0], selected: ['none'] },
  ]);

  const options = useMemo(() => {
    const remainingOptions = baseOptions.filter((option) => {
      const spaceIndex = option.indexOf(' ');
      const name = spaceIndex > -1 ? option.slice(0, spaceIndex) : option;

      return !listTags.find(({ tag }) => name === tag?.name);
    });

    if (remainingOptions.length) {
      remainingOptions.push('none');
    }

    return remainingOptions;
  }, [baseOptions, listTags]);

  const handleChangeTag = useCallback(
    (id: string) => (selected: string[]) => {
      setList((list) => {
        const copy = list.slice();
        const index = list.findIndex(({ id: itemId }) => itemId === id);

        if (index > -1) {
          copy[index].selected = selected;

          if (selected[0] !== 'none') {
            const spaceIndex = selected[0].indexOf(' ');
            const tagName =
              spaceIndex > -1 ? selected[0].slice(0, spaceIndex) : selected[0];
            copy[index].tag = tags.find(({ name }) => name === tagName);
          } else {
            copy[index].tag = undefined;
          }
        }

        return copy;
      });
    },
    [tags],
  );

  useEffect(() => {
    window.addEventListener('storage', function (e) {
      if (e.key === schematisedTagAddEvent) {
        dispatch.schematisedTags.fetch();
      }
    });
  }, [dispatch]);

  const featureGroup = useSelector<RootState, FeatureGroupViewState>(
    (state) => state.featureGroupView,
  );

  const trainingDataset = useSelector(
    (state: RootState) => state.trainingDatasetView,
  );

  const handleAddTag = useCallback(() => {
    setList((list) => {
      const copy = list.slice();
      copy.push({ id: randomArrayString(10)[0], selected: ['none'] });

      return copy;
    });
  }, []);

  const handleRemove = useCallback(
    (index: number) => () => {
      setList((list) => {
        const copy = list.slice();
        copy.splice(index, 1);

        const deletedName = list[index].tag?.name;

        const tags = getValues('tags');
        const filtered = Object.keys(tags).filter(
          (name) => name !== deletedName,
        );

        setValue(
          'tags',
          filtered.reduce((acc, key) => ({ ...acc, [key]: tags[key] }), {}),
        );

        return copy;
      });
    },
    [setValue, getValues],
  );

  useEffect(() => {
    const serverTags =
      type === ItemDrawerTypes.fg ? featureGroup?.tags : trainingDataset?.tags;

    if (serverTags && serverTags?.length) {
      setList(() => {
        return serverTags
          .map(({ name }) => name)
          .reduce((acc: ListItem[], key) => {
            const tag = tags.find(({ name }) => name === key);

            const item = {
              id: randomArrayString(10)[0],
              selected: [
                tag?.description ? `${key} - ${tag?.description}` : key,
              ],
              tag,
            };

            return [...acc, item];
          }, []);
      });

      setValue(
        'tags',
        serverTags.reduce(
          (acc, { name, tags }) => ({ ...acc, [name]: tags }),
          {},
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingServerTagsFG, isLoadingServerTagsTD, type]);

  if (isLoading || isLoadingServerTagsFG || isLoadingServerTagsTD) {
    return (
      <Box>
        <Flex mb="10px">
          <Value>Tags schemas</Value>
        </Flex>
        <Labeling gray>loading...</Labeling>
      </Box>
    );
  }

  if (!tags.length) {
    return (
      <Box>
        <Flex mb="10px">
          <Value>Tags</Value>
        </Flex>

        <Callout
          content="There are no tags defined"
          type={CalloutTypes.neutral}
          cta={
            <Button
              intent="ghost"
              onClick={() =>
                window.open(
                  `/${routeNames.settings.schematisedTags.create}`,
                  '_blank',
                )
              }
            >
              Create a new tag schema ↗
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <>
      {listTags.map((item, index) => (
        <SingleTag
          item={item}
          key={item.id}
          options={options}
          onAdd={handleAddTag}
          isFirstItem={!index}
          isDisabled={isDisabled}
          onRemove={handleRemove(index)}
          onChange={handleChangeTag(item.id)}
          hasNext={index < listTags.length - 1}
          isLastItem={index === listTags.length - 1}
        />
      ))}
    </>
  );
};

export default SchematisedTags;
