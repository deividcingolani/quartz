import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import {
  Subtitle,
  Value,
  Button,
  Tooltip,
  Symbol,
  SymbolMode,
} from '@logicalclocks/quartz';
// eslint-disable-next-line import/no-unresolved
import { ItemDrawerTypes } from '../drawer/ItemDrawer';
import useBasket from '../../hooks/useBasket';
import icons from '../../sources/icons';

export interface PanelProps {
  isEditDisabled?: boolean;
  onClickEdit: () => void;
  onClickRefresh: () => void;
  title?: string;
  id?: number;
  hasCommitDropdown?: boolean;
  commitDropdown?: React.ReactElement;
  hasVersionDropdown?: boolean;
  versionDropdown?: React.ReactElement;
  hasSplitDropdown?: boolean;
  splitDropdown?: React.ReactElement;
  idColor: string;
  type?: ItemDrawerTypes;
  data?: any;
}

const panelStyles = {
  bg: 'white',
  position: 'absolute',
  top: 0,
  left: 0,
  boxShadow: '0px 4px 163px -99px rgba(0, 0, 0, 0.25)',

  // Top shadow
  ':after': {
    content: '""',
    width: '100%',
    height: '10px',
    position: 'absolute',
    top: '-10px',
  },
};

const Panel: FC<PanelProps> = ({
  onClickEdit,
  onClickRefresh,
  isEditDisabled,
  title,
  id,
  idColor,
  hasCommitDropdown,
  commitDropdown,
  hasVersionDropdown = false,
  versionDropdown,
  hasSplitDropdown = false,
  splitDropdown,
  type = ItemDrawerTypes.td,
  data,
}) => {
  const { isActiveFeatures, handleBasket, isSwitch } = useBasket();

  return (
    <Flex alignItems="center" height="50px" sx={panelStyles} width="100%">
      <Flex alignItems="flex-end">
        <Subtitle ml="30px">{title}</Subtitle>

        <Value mt="auto" ml="5px" mr="15px" sx={{ color: idColor }}>
          #{id}
        </Value>

        {isSwitch && !!data && type === ItemDrawerTypes.fg && (
          <Box onClick={(e) => e.stopPropagation()} ml="-5px" mr="10px">
            <Symbol
              possible={data.features.length > 0}
              handleClick={handleBasket(data.features, data)}
              mode={SymbolMode.bulk}
              tooltipMainText={
                isActiveFeatures(data.features, data)
                  ? 'Remove all features from basket'
                  : 'Add all features to basket'
              }
              tooltipSecondaryText={`${data.features.length} features`}
              inBasket={isActiveFeatures(data.features, data)}
            />
          </Box>
        )}

        {hasVersionDropdown && versionDropdown}
        {hasCommitDropdown && commitDropdown}
        {hasSplitDropdown && splitDropdown}
      </Flex>
      <Flex ml="auto">
        <Tooltip
          disabled={!isEditDisabled}
          mainText="You have no edit right on the feature store"
        >
          <Button
            intent="ghost"
            disabled={isEditDisabled}
            onClick={onClickEdit}
          >
            edit
          </Button>
        </Tooltip>
        <Box ml="15px" mr="50px">
          <Tooltip mainText="Refresh">
            <Flex
              onClick={onClickRefresh}
              backgroundColor="#FFFFFF"
              justifyContent="center"
              alignItems="center"
              width="34px"
              height="32px"
              sx={{
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: 'grayShade1',
                cursor: 'pointer',
                transition: 'all .25s ease',

                ':hover': {
                  borderColor: 'black',
                },
              }}
            >
              {icons.refresh}
            </Flex>
          </Tooltip>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Panel;
