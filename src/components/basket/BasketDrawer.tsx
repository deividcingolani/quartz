import { Flex } from 'rebass';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Labeling, Button, Popup, Text } from '@logicalclocks/quartz';
import { useNavigate, useParams } from 'react-router-dom';
import { Dispatch } from '../../store';
import BasketFeatures from './BasketFeatures';
import {
  selectBasketFeaturesLength,
  selectFeatureGroups,
} from '../../store/models/localManagement/basket.selectors';
import { placeholder } from '../../sources/basketSvg';

export interface BasketDrawerProps {
  isOpen: boolean;
  mode?: Mode;
  isSwitched: boolean;
  handleToggle: () => void;
}

export enum Mode {
  draft = 'draft',
  direct = 'direct',
}

const BasketDrawer: FC<BasketDrawerProps> = ({
  isOpen,
  mode = Mode.direct,
  isSwitched,
  handleToggle,
}) => {
  const featureGroups = useSelector(selectFeatureGroups);
  const featureLength = useSelector(selectBasketFeaturesLength);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const directMode = mode === Mode.direct;

  const BasketDisabled = () => (
    <Flex alignItems="center" px="40px" flexDirection="column">
      <Button m="20px" onClick={() => dispatch.basket.switch(true)}>
        Start feature selection
      </Button>
      <Labeling bold mb="20px" textAlign="center">
        Start feature selection to display markers
        <br /> and pick the features for your new <br /> training dataset
      </Labeling>
    </Flex>
  );

  const BasketEnabledNoFeatures = () => (
    <>
      <Flex p="10px">
        <Button
          intent="secondary"
          onClick={() => {
            if (directMode) {
              dispatch.basket.switch(false);
            } else {
              navigate(`/p/${projectId}/td/new`);
            }
            handleToggle();
          }}
        >
          {directMode ? 'Cancel feature selection' : 'Back to training dataset'}
        </Button>
      </Flex>
      <Flex mt="20px" alignItems="center" flexDirection="column" mx="40px">
        <Text my="20px">{placeholder}</Text>
        <Labeling bold textAlign="center" mb="40px" mt="10px">
          Use markers to pick the features <br /> of your training dataset
        </Labeling>
      </Flex>
    </>
  );

  const BasketEnabledFeaturesSelected = () => (
    <>
      <Flex p="10px" justifyContent="space-between">
        <Button
          intent="secondary"
          disabled={!featureGroups.length}
          onClick={() => {
            handleToggle();
            navigate(`/p/${projectId}/td/new`);
          }}
        >
          {directMode ? 'New training dataset' : 'Back to training dataset'}
        </Button>
        <Labeling
          px="15px"
          py="8px"
          bold
          style={{ cursor: 'pointer' }}
          color="labels.red"
          alignSelf="center"
          onClick={dispatch.basket.clear}
          disabled={!featureGroups.length}
        >
          empty basket
        </Labeling>
      </Flex>
      {featureGroups.map(({ features, fg, projectId }) => (
        <BasketFeatures
          key={fg.id}
          parent={fg}
          data={features}
          projectId={projectId}
        />
      ))}
    </>
  );

  return (
    <Popup
      onClose={handleToggle}
      overflow="hidden"
      width="330px"
      minWidth="330px"
      minHeight="0px"
      right="8px"
      left="none"
      top="77px"
      style={{ maxHeight: 'calc(100% - (77px + 8px))', borderTop: 0 }}
      hasBackdrop={false}
      isOpen={isOpen}
    >
      <Flex
        justifyContent="space-between"
        sx={{ backgroundColor: 'labels.green' }}
        p="15px"
      >
        <Labeling color="white">Feature Basket</Labeling>
        <Text
          style={{ color: 'white', cursor: 'pointer' }}
          onClick={handleToggle}
        >
          <svg
            width="10"
            height="9"
            viewBox="0 0 10 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.63155 0.437C1.40375 0.216313 1.0344 0.216313 0.806597 0.437C0.578791 0.657687 0.578791 1.01549 0.806597 1.23618L4.17519 4.4995L0.806631 7.7628C0.578826 7.98348 0.578826 8.34129 0.806631 8.56198C1.03444 8.78266 1.40378 8.78266 1.63159 8.56198L5.00015 5.29868L8.36871 8.56198C8.59652 8.78266 8.96586 8.78266 9.19367 8.56198C9.42148 8.34129 9.42148 7.98348 9.19367 7.7628L5.82511 4.4995L9.1937 1.23618C9.42151 1.01549 9.42151 0.657687 9.1937 0.437C8.9659 0.216313 8.59655 0.216313 8.36875 0.437L5.00015 3.70033L1.63155 0.437Z"
              fill="white"
            />
          </svg>
        </Text>
      </Flex>
      <Flex overflow="auto" flexDirection="column">
        {!isSwitched && <BasketDisabled />}
        {isSwitched && featureLength === 0 && <BasketEnabledNoFeatures />}
        {isSwitched && featureLength > 0 && <BasketEnabledFeaturesSelected />}
      </Flex>
    </Popup>
  );
};

export default BasketDrawer;
