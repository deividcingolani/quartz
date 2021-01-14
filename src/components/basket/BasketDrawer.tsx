import { Flex } from 'rebass';
import React, { FC } from 'react';
import { Dispatch } from '../../store';
import BasketFeatures from './BasketFeatures';
import { useDispatch, useSelector } from 'react-redux';
import { Label, Button, Value, Popup, Labeling } from '@logicalclocks/quartz';
import {
  selectBasketFeaturesLength,
  selectFeatureGroups,
} from '../../store/models/localManagement/basket.selectors';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '../divider/Devider';

export interface BasketDrawerProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const BasketDrawer: FC<BasketDrawerProps> = ({ isOpen, handleToggle }) => {
  const featureGroups = useSelector(selectFeatureGroups);
  const featureLength = useSelector(selectBasketFeaturesLength);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  return (
    <Popup onClose={handleToggle} overflow="hidden" isOpen={isOpen}>
      <Flex overflowY="auto" flexDirection="column">
        <Flex p="20px" pt="30px" width="100%" flexDirection="column" mt="-10px">
          <Label fontSize="18px">Basket</Label>
          <Flex mt="20px">
            <Value primary>{featureLength}</Value>
            <Value ml="5px">features selected from</Value>
            <Value ml="5px" primary>
              {featureGroups.length}
            </Value>
            <Value ml="5px">different feature groups</Value>
          </Flex>
          <Button
            mt="15px"
            intent="ghost"
            alignSelf="flex-end"
            onClick={dispatch.basket.clear}
            disabled={!featureGroups.length}
          >
            empty basket
          </Button>
        </Flex>
      </Flex>
      <Divider ml="20px" mr="20px" />
      <Flex height="620px" overflow="auto" flexDirection="column">
        {!!featureGroups.length ? (
          featureGroups.map(({ features, fg, projectId }) => (
            <BasketFeatures
              key={fg.id}
              parent={fg}
              data={features}
              projectId={projectId}
            />
          ))
        ) : (
          <Flex mt="20px" justifyContent="center">
            <Labeling fontSize="18px" gray bold>
              This basket is empty
            </Labeling>
          </Flex>
        )}
      </Flex>
      <Flex p="20px" bg="grayShade3" justifyContent="flex-end">
        <Button onClick={handleToggle} mr="20px" intent="secondary">
          Back
        </Button>
        <Button
          disabled={!featureGroups.length}
          onClick={() => {
            handleToggle();
            navigate(`/p/${projectId}/td/new`);
          }}
        >
          Create training dataset
        </Button>
      </Flex>
    </Popup>
  );
};

export default BasketDrawer;
