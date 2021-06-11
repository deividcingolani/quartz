import React, { FC, useMemo, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Labeling, Tooltip, Value } from '@logicalclocks/quartz';
import { ItemDrawerTypes } from '../../../components/drawer/ItemDrawer';
import icons from '../../../sources/icons';
import { LSDataEntity } from '../../../services/project/ShortcutsService';

export interface ShortcutItemProps {
  item: LSDataEntity;
  pinnable?: boolean;
  pinned?: boolean;
  handleClick: (item: LSDataEntity) => void;
  handlePin?: (item: LSDataEntity) => void;
  handleUnPin?: (item: LSDataEntity) => void;
}

export enum DTO {
  'fg' = 'cachedFeaturegroupDTO',
  'td' = 'trainingDatasetDTO',
}

const ShortCutItem: FC<ShortcutItemProps> = ({
  item,
  pinnable = false,
  pinned = false,
  handlePin,
  handleUnPin,
  handleClick,
}) => {
  const [hover, setHover] = useState(false);

  const type = useMemo(
    () => (item.type === DTO.fg ? ItemDrawerTypes.fg : ItemDrawerTypes.td),
    [item.type],
  );

  const handlePinClick = (e: any) => {
    e.stopPropagation();
    if (pinned) {
      if (handleUnPin) handleUnPin(item);
    } else {
      if (handlePin) handlePin(item);
    }
  };

  const color = useMemo(
    () => (type === ItemDrawerTypes.fg ? 'labels.orange' : 'labels.purple'),
    [type],
  );

  return (
    <Flex
      p="8px"
      alignItems="center"
      sx={{
        cursor: 'pointer',
        ':hover': {
          bg: 'grayShade2',
        },
      }}
      justifyContent="space-between"
      onClick={() => handleClick(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Flex>
        <Box
          height="18px"
          sx={{
            svg: {
              width: '18px',
              height: '18px',
              path: {
                fill: color,
              },
            },
          }}
        >
          {icons[type]}
        </Box>
        <Flex ml="4px">
          <Labeling bold>{item.name}</Labeling>
          <Value
            ml="5px"
            sx={{ color: color }}
          >
            #{item.id}
          </Value>
        </Flex>
      </Flex>
      {pinnable && hover && (
        <Tooltip
          mainText={pinned ? 'Unpin from shortcuts' : 'Pin to shortcuts'}
        >
          <Box
            onClick={handlePinClick}
            height="18px"
            sx={{
              ':hover': {
                bg: 'grayShade1',
              },
            }}
          >
            {pinned ? icons.pin_solid : icons.pin_light}
          </Box>
        </Tooltip>
      )}
    </Flex>
  );
};

export default ShortCutItem;
