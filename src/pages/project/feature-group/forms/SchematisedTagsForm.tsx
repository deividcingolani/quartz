import { Box, Flex } from 'rebass';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Callout, CalloutTypes, Value } from '@logicalclocks/quartz';

// Types
import { FeatureFormProps } from '../types';
import { SchematisedTagEntity } from '../../../../types/feature-group';
// Components
import SingleTag from './SingleTag';
// Selectors
import { selectSchematisedTags } from '../../../../store/models/schematised-tags/schematised-tags.selectors';
// Utils
import { randomArrayString } from '../../../../utils';

import routeNames from '../../../../routes/routeNames';

export interface ListItem {
  id: string;
  selected: string[];
  tag?: SchematisedTagEntity;
}

const SchematisedTags: FC<FeatureFormProps> = ({ isDisabled }) => {
  const tags = useSelector(selectSchematisedTags).sort((tagA, tagB) =>
    tagA.name.localeCompare(tagB.name),
  );

  const { getValues, setValue } = useFormContext();

  const navigate = useNavigate();

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
    const serverTags = getValues('tags');

    if (serverTags && Object.values(serverTags).length) {
      setList(() => {
        return Object.keys(serverTags).reduce((acc: ListItem[], key) => {
          const tag = tags.find(({ name }) => name === key);
          const item = {
            id: randomArrayString(10)[0],
            selected: [tag?.description ? `${key} - ${tag?.description}` : key],
            tag,
          };

          return [...acc, item];
        }, []);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tags.length) {
    return (
      <Box>
        <Flex mb="10px">
          <Value>Schematised tags</Value>
        </Flex>

        <Callout
          content="There are no schematised tags defined"
          type={CalloutTypes.neutral}
          cta={
            <Button
              intent="ghost"
              onClick={() =>
                navigate(`/${routeNames.settings.schematisedTags.create}`)
              }
            >
              Create a schematised tag
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
          index={index}
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
