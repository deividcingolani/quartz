import { Box, Flex } from 'rebass';
import { Text, Tooltip, usePopup } from '@logicalclocks/quartz';
import React, { FC, useCallback, useRef, memo, useState, useReducer, useEffect } from 'react';
import svg from '../../../sources/basketSvg';
import { useSelector } from 'react-redux';
import {
  selectBasketFeaturesLength,
  selectFeatureGroups,
  selectSwitch,
} from '../../../store/models/localManagement/basket.selectors';
import BasketDrawer from '../../../components/basket/BasketDrawer';

import {
  basketContainerStyles,
  openBasketIconStyles,
  featureCountStyles,
} from './basket.styles';
import { FeatureGroupBasket } from '../../../store/models/localManagement/basket.model';



const BasketMenu: FC = () => {
  const featureLength = useSelector(selectBasketFeaturesLength);
  const featureGroups = useSelector(selectFeatureGroups);
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
