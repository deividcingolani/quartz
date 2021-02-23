import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Button, Select, Value, Divider } from '@logicalclocks/quartz';

import routeNames from '../../../../routes/routeNames';
// Components
import { ListItem } from './SchematisedTagsForm';
import PrimitiveTypeForm from './PrimitiveTypeForm';
import ArrayTypeForm from './ArrayTypeForm';

export interface SingleTagProps {
  item: ListItem;
  hasNext: boolean;
  options: string[];
  onAdd: () => void;
  isDisabled: boolean;
  isLastItem: boolean;
  isFirstItem: boolean;
  onRemove: () => void;
  onChange: (selected: string[]) => void;
}

const SingleTag: FC<SingleTagProps> = ({
  item: { selected, tag },
  onAdd,
  hasNext,
  options,
  onChange,
  onRemove,
  isDisabled,
  isLastItem,
  isFirstItem,
}) => {
  return (
    <>
      <Flex mb="20px" width="100%" flexDirection="column">
        <Flex width="100%" flexDirection="column">
          <Flex justifyContent="space-between">
            {isFirstItem && <Value mt="10px">Tags</Value>}
            {isFirstItem && (
              <Button
                mr="-15px"
                onClick={() =>
                  window.open(
                    `/${routeNames.settings.schematisedTags.create}`,
                    '_blank',
                  )
                }
                disabled={isDisabled}
                intent="inline"
              >
                Create a new tag schema ↗
              </Button>
            )}
          </Flex>

          <Select
            disabled={hasNext || isDisabled}
            listWidth="100%"
            width="100%"
            options={options}
            value={selected}
            placeholder=""
            onChange={onChange}
          />
        </Flex>

        {!!tag &&
          Object.keys(tag.properties).map((key) => {
            const type = tag.properties[key].type;
            if (type === 'array') {
              return (
                <ArrayTypeForm
                  tag={tag}
                  name={key}
                  isDisabled={isDisabled}
                  key={`${tag.name}-${key}`}
                  type={tag.properties[key].items?.type}
                />
              );
            }
            return (
              <PrimitiveTypeForm
                tag={tag}
                name={key}
                type={type}
                isDisabled={isDisabled}
                key={`${tag.name}-${key}`}
              />
            );
          })}

        {isLastItem && !!tag && !!options.length && (
          <Button
            mt="10px"
            disabled={isDisabled}
            alignSelf="flex-end"
            onClick={onAdd}
          >
            Add another tag
          </Button>
        )}

        {hasNext && (
          <Button
            mt="10px"
            intent="ghost"
            alignSelf="flex-end"
            onClick={onRemove}
            disabled={isDisabled}
          >
            Remove tag schema
          </Button>
        )}
      </Flex>

      {!isLastItem && <Divider mb="15px" mt="15px" />}
    </>
  );
};

export default SingleTag;
