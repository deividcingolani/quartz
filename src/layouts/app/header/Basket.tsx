import { Box } from 'rebass';
import {
  Text,
  List,
  Icon,
  Tooltip,
  ListItem,
  useDropdown,
  useOnClickOutside,
  usePopup,
} from '@logicalclocks/quartz';
import React, { FC, useRef } from 'react';
import { Dispatch } from '../../../store';
import svg from '../../../sources/basketSvg';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBasketFeaturesLength,
  selectSwitch,
} from '../../../store/models/localManagement/basket.selectors';
import BasketDrawer from '../../../components/basket/BasketDrawer';

const BasketMenu: FC = () => {
  const dispatch = useDispatch<Dispatch>();

  const featureLength = useSelector(selectBasketFeaturesLength);
  const isSwitched = useSelector(selectSwitch);

  const buttonRef = useRef(null);

  const [isOpen, handleToggle, handleClickOutside] = useDropdown();
  const [isOpenPopup, handleTogglePopup] = usePopup(false);

  useOnClickOutside(buttonRef, handleClickOutside);

  return (
    <>
      <BasketDrawer isOpen={isOpenPopup} handleToggle={handleTogglePopup} />
      <Box mt="5px" mr="15px" ref={buttonRef} sx={{ position: 'relative' }}>
        <Text sx={{ cursor: 'pointer' }} onClick={() => handleToggle()}>
          {isSwitched ? svg.open : svg.close}
        </Text>
        {isOpen && (
          <List
            overflow="visible"
            style={{ position: 'absolute', right: '-15px', top: '25px' }}
          >
            <ListItem onClick={() => dispatch.basket.switch(!isSwitched)}>
              {isSwitched ? 'Hide markers' : 'Show markets'}
            </ListItem>
            <ListItem onClick={handleTogglePopup}>Open basket</ListItem>
            <ListItem
              backgroundColor="grayShade3"
              color="gray"
              style={{
                borderTop: '1px solid gray',
              }}
            >
              {featureLength} features selected
              <Box ml="5px">
                <Tooltip mainText="Collect feature using this basket">
                  <Icon icon="info-circle" size="sm" />
                </Tooltip>
              </Box>
            </ListItem>
          </List>
        )}
      </Box>
    </>
  );
};

export default BasketMenu;
