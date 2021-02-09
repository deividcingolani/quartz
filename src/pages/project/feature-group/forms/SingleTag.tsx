import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, Value, Divider } from '@logicalclocks/quartz';

import routeNames from '../../../../routes/routeNames';
// Components
import { ListItem } from './SchematisedTagsForm';
import PrimitiveTypeForm from './PrimitiveTypeForm';
import ArrayTypeForm from './ArrayTypeForm';

export interface SingleTagProps {
  index: number;
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
  index,
  onAdd,
  hasNext,
  options,
  onChange,
  onRemove,
  isDisabled,
  isLastItem,
  isFirstItem,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Flex mb="20px" width="100%" flexDirection="column">
        <Flex width="100%" flexDirection="column">
          <Flex justifyContent="space-between">
            <Value mt="10px">Schematised tag #{index + 1}</Value>
            {isFirstItem && (
              <Button
                mr="-15px"
                onClick={() =>
                  navigate(`/${routeNames.settings.schematisedTags.create}`)
                }
                disabled={isDisabled}
                intent="inline"
              >
                Create a schematised tag
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
            Add another schematised tag
          </Button>
        )}

        {hasNext && (
          <Button
            mr="-15px"
            mt="10px"
            intent="inline"
            alignSelf="flex-end"
            onClick={onRemove}
            disabled={isDisabled}
          >
            Remove schematised tag
          </Button>
        )}
      </Flex>

      {!isLastItem && <Divider mb="15px" mt="15px" />}
    </>
  );
};

export default SingleTag;
