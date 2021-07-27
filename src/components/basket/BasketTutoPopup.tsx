// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useState, useCallback } from 'react';
import { Flex, Box } from 'rebass';
import {
  Label,
  Button,
  Popup,
  Labeling,
  Divider,
  Checkbox,
} from '@logicalclocks/quartz';
// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// Types
import { Dispatch, RootState } from '../../store';
// Utils
import baskeTutoImage1 from './basket_tuto_images/basket_tuto_1.png';
import baskeTutoImage2 from './basket_tuto_images/basket_tuto_2.png';
import baskeTutoImage3 from './basket_tuto_images/basket_tuto_3.png';
import baskeTutoImage4 from './basket_tuto_images/basket_tuto_4.png';
import { isSelectionActive } from './utils';

export interface BasketTutoPopupProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const BasketTutoPopup: FC<BasketTutoPopupProps> = ({
  isOpen,
  handleToggle,
}) => {
  const isSelActive = isSelectionActive();
  const [checked, setChecked] = useState<boolean>(false);

  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const handleClose = useCallback(() => {
    if (checked) {
      dispatch.basket.showTutorial({
        userId,
        projectId: +projectId,
        showTutorial: false,
      });
    }
    handleToggle();
  }, [checked, dispatch.basket, handleToggle, userId, projectId]);

  return (
    <Popup
      onClose={handleToggle}
      maxHeight="calc(100vh - 20px);"
      overflow="hidden"
      isOpen={isOpen}
      width="460px"
    >
      <Flex overflowY="auto" flexDirection="column">
        <Flex p="20px" pt="30px" width="100%" flexDirection="column" mt="-10px">
          <Label fontSize="18px">How to pick features from the UI?</Label>
          <Divider mt="20px" />
          <Labeling gray bold>
            To perform your feature selection, you will find markers that let
            you pick your features where they are: in feature groups and
            statistics.
          </Labeling>
          <Labeling mt="50px" bold>
            1. Navigate through feature groups and pick features using markers
          </Labeling>
          <Flex mt="12px" justifyContent="center">
            <Flex width="50%" mr="10px" flexDirection="column">
              <Box width="100%">
                <img
                  width="100%"
                  src={baskeTutoImage1}
                  alt="Pick features individually"
                />
              </Box>
              <Labeling bold gray>
                Individually
              </Labeling>
            </Flex>
            <Flex width="50%" ml="10px" flexDirection="column">
              <Box width="100%">
                <img
                  width="100%"
                  src={baskeTutoImage2}
                  alt="Pick features in bulk"
                />
              </Box>
              <Labeling bold gray>
                In bulk
              </Labeling>
            </Flex>
          </Flex>
          <Labeling mt="50px" bold>
            2. Open your list of selected features to manage your feature
            selection
          </Labeling>
          <Flex mt="12px" justifyContent="center">
            <img
              width="100%"
              src={baskeTutoImage3}
              alt="Open basket during the feature selection"
            />
          </Flex>
          <Labeling mt="50px" bold>
            3. Come back to your training dataset to finalise it
          </Labeling>
          <Divider mt="50px" />
          <Labeling mt="30px" bold>
            Note that you can start your feature selection before creating your
            training dataset at any moment by calling the basket.
          </Labeling>
          <Flex mt="12px" mb="12px" justifyContent="center">
            <img
              width="100%"
              src={baskeTutoImage4}
              alt="Start feature selection"
            />
          </Flex>
        </Flex>
      </Flex>
      <Divider ml="20px" mr="20px" mb="0px" mt="0px" />
      <Flex
        p="15px 20px 15px 20px"
        bg="grayShade3"
        justifyContent="space-between"
        alignItems="center"
      >
        {isSelActive ? (
          <Checkbox
            label="Don't display this message next time"
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
          />
        ) : (
          <Flex />
        )}

        <Flex />
        <Button onClick={handleClose} intent="secondary">
          Got it
        </Button>
      </Flex>
    </Popup>
  );
};

export default BasketTutoPopup;
