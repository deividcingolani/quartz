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
    return tags.reduce((accumulator, { name, description = '' }) => {
      accumulator.set(name, description);
      return accumulator;
    }, new Map<string, string>());

    // return tags.forEach(({ name, description }) =>

    //   description ? `${name} - ${description}` : name,
    // );
  }, [tags]);

  const initialTags = (): ListItem[] => {
    if (type === ItemDrawerTypes.td) {
      const infoTD = localStorage.getItem('info');
      if (infoTD) {
        return (
          JSON.parse(infoTD).listTags || [
            { id: randomArrayString(10)[0], selected: [] },
          ]
        );
      }
    }

    return [{ id: randomArrayString(10)[0], selected: [] }];
  };

  const [listTags, setList] = useState<ListItem[]>(initialTags());

  const options = useMemo(() => {
    const remainingOptions = new Map<string, string>();
    baseOptions.forEach((description, name) => {
      if (!listTags.find(({ tag }) => name === tag?.name)) {
        return remainingOptions.set(name, description);
      }

      return;
    });

    return remainingOptions;
  }, [baseOptions, listTags]);

  const handleChangeTag = useCallback(
    (id: string) => (selected: string[]) => {
      setList((list) => {
        const copy = list.slice();
        const index = list.findIndex(({ id: itemId }) => itemId === id);

        if (index > -1) {
          copy[index].selected = selected;
          if (selected[0] !== '') {
            // const spaceIndex = selected[0].indexOf(' ');
            // const tagName =
            // spaceIndex > -1 ? selected[0].slice(0, spaceIndex) : selected[0];
            copy[index].tag = tags.find(({ name }) => name === selected[0]);
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
      copy.push({ id: randomArrayString(10)[0], selected: [] });

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
    const infoTD: { [key: string]: string } | any = localStorage.getItem(
      'info',
    );
    if (infoTD) {
      const newInfoTD = Object.assign({}, JSON.parse(infoTD), {
        listTags: listTags,
      });
      localStorage.setItem('info', JSON.stringify(newInfoTD));
    }
  }, [listTags, isLoadingServerTagsTD]);

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
          content="There are no tags schemas"
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
          options={Array.from(options.keys())}
          descriptions={Array.from(options.values())}
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
