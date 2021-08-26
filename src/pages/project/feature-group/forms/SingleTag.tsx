// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';

import { Flex } from 'rebass';
import {
  Button,
  Select,
  Divider,
  IconButton,
  IconName,
} from '@logicalclocks/quartz';

// Components
import PrimitiveTypeForm from './PrimitiveTypeForm';
import ArrayTypeForm from './ArrayTypeForm';
import { ListItem } from '../../../../types/feature-group';

export interface SingleTagProps {
  item: ListItem;
  hasNext: boolean;
  options: string[];
  onAdd: () => void;
  isDisabled: boolean;
  isLastItem: boolean;
  isFirstItem: boolean;
  isFirstAddTagSchemas: boolean;
  descriptions: string[];
  onRemove: () => void;
  onChange: (selected: string[]) => void;
}

const SingleTag: FC<SingleTagProps> = ({
  item: { selected, tag },
  onAdd,
  options,
  onChange,
  onRemove,
  isDisabled,
  isLastItem,
  isFirstItem,
  descriptions,
}) => {
  return (
    <>
      <Flex mb="20px" width="100%" flexDirection="column">
        <Flex width="100%">
          <Flex flex="1">
            <Select
              needSwap
              listWidth="100%"
              width="100%"
              options={options}
              value={selected}
              placeholder={
                selected.length ? tag!.description : 'pick a tag schema'
              }
              additionalTexts={descriptions}
              onChange={onChange}
              deletabled={true}
            />
          </Flex>
          <Flex ml="8px">
            <IconButton
              icon={IconName.bin}
              intent="primary"
              onClick={onRemove}
              tooltip="Remove"
            />
          </Flex>
        </Flex>
        {!!tag && (
          <Flex
            flexDirection="column"
            ml="8px"
            mt="20px"
            pl="8px"
            sx={{
              borderLeftStyle: 'solid',
              borderLeftWidth: '1px',
              borderLeftColor: 'grayShade2',
              gap: '20px',
            }}
          >
            {Object.keys(tag.properties).map((key) => {
              const { type } = tag.properties[key];
              const { description } = tag.properties[key];
              if (type === 'array') {
                return (
                  <ArrayTypeForm
                    tag={tag}
                    name={key}
                    description={description}
                    isDisabled={isDisabled}
                    key={`${tag.name}-${key}`}
                    type={tag.properties[key].type}
                    itemType={tag.properties[key].items?.type}
                    isFirstItem={isFirstItem}
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
                  description={description}
                />
              );
            })}
          </Flex>
        )}
        {isLastItem && !!options.length && (
          <Button
            mt="20px"
            disabled={isDisabled}
            alignSelf="flex-start"
            onClick={onAdd}
            intent="ghost"
          >
            Add another tag
          </Button>
        )}
      </Flex>

      {!isLastItem && <Divider mb="15px" mt="15px" />}
    </>
  );
};

export default SingleTag;
