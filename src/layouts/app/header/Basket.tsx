// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useRef, memo } from 'react';
import { Box, Flex } from 'rebass';
import { Text, Tooltip, usePopup } from '@logicalclocks/quartz';
import { useSelector } from 'react-redux';
import svg from '../../../sources/basketSvg';
import {
  selectBasketFeaturesLength,
  selectSwitch,
} from '../../../store/models/localManagement/basket.selectors';
import BasketDrawer from '../../../components/basket/BasketDrawer';

import {
  basketContainerStyles,
  openBasketIconStyles,
  featureCountStyles,
} from './basket.styles';

const BasketMenu: FC = () => {
  const featureLength = useSelector(selectBasketFeaturesLength);
  const isSwitched = useSelector(selectSwitch);

  const buttonRef = useRef(null);

  const [isOpenPopup, handleTogglePopup] = usePopup(false);

  return (
    <>
      <BasketDrawer
        isOpen={isOpenPopup}
        handleToggle={handleTogglePopup}
        isSwitched={isSwitched}
      />
      <Box ref={buttonRef} sx={{ position: 'relative', right: '16px' }}>
        <Tooltip mainText="Feature basket">
          {isSwitched ? (
            <Flex sx={basketContainerStyles} onClick={handleTogglePopup}>
              <Text sx={openBasketIconStyles}>{svg.open}</Text>
              <Text sx={featureCountStyles}>{featureLength}</Text>
            </Flex>
          ) : (
            <Text sx={basketContainerStyles} onClick={handleTogglePopup}>
              {svg.close}
            </Text>
          )}
        </Tooltip>
      </Box>
    </>
  );
};

export default memo(BasketMenu);
