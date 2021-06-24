// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Text, Value } from '@logicalclocks/quartz';

// Types
import { DataEntity } from '../../types';
import { ItemDrawerTypes } from '../drawer/ItemDrawer';

export interface SearchItemCardProps {
  index: number;
  search: string;
  activeIndex: number;
  type: ItemDrawerTypes;
  handleClick: () => void;
  item: DataEntity;
}

const SearchItemCard: FC<SearchItemCardProps> = ({
  item,
  type,
  index,
  search = '',
  handleClick,
  activeIndex,
}) => {
  const matchPartIndex = item.name.indexOf(search);

  return (
    <Flex
      sx={{
        cursor: 'pointer',
        ':hover': {
          bg: 'grayShade2',
        },
      }}
      px="12px"
      height="30px"
      alignItems="center"
      onClick={handleClick}
      bg={index === activeIndex ? 'grayShade2' : 'white'}
    >
      <Text>{item.name.slice(0, matchPartIndex)}</Text>
      <Value fontWeight={900}>
        {item.name.slice(matchPartIndex, matchPartIndex + search.length)}
      </Value>
      <Text>{item.name.slice(matchPartIndex + search.length)}</Text>
      <Value
        ml="5px"
        sx={{
          color:
            type === ItemDrawerTypes.fg ? 'labels.orange' : 'labels.purple',
        }}
      >
        #{item.id}
      </Value>
    </Flex>
  );
};

export default SearchItemCard;
