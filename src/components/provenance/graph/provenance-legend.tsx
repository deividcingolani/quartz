// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Box, Flex } from 'rebass';

import { Divider, Labeling, User } from '@logicalclocks/quartz';
import batchStyles from './provenance-legend.styles';
import {
  NodeTypes,
  ProvenanceNode,
  ProvenanceLink,
  EventTarget,
} from '../types';
import getColor from '../utils/legendUtils';
import ProfileService from '../../../services/ProfileService';

export interface selectedNode {
  type: EventTarget;
  element: ProvenanceNode | ProvenanceLink;
}
export interface ProvenanceLegendProps {
  shiftPressed: boolean;
  colors: Record<NodeTypes, string>;
  selected: selectedNode | null;
}

const ProvenanceLegend: FC<ProvenanceLegendProps> = ({
  colors,
  selected,
  shiftPressed,
  ...props
}: ProvenanceLegendProps) => {
  const nodes = Object.values(NodeTypes).slice(0, -1);

  const showExtra = [
    NodeTypes.featureGroup,
    NodeTypes.trainingDataset,
  ].includes(selected?.element.type as NodeTypes);

  return (
    <Flex {...props} mt="20px" mb="-10px" width="100%" flexDirection="column">
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex {...props} flexDirection="row">
          {nodes.map((key: string) => (
            <Flex key={`legend-${key}`} mr="12px">
              <Box
                mr="5px"
                mt="3px"
                sx={batchStyles(colors[key as NodeTypes], EventTarget.node)}
              />
              <Labeling>{key}</Labeling>
            </Flex>
          ))}
        </Flex>
        <Flex>
          <Labeling gray={!shiftPressed} mr="2px">
            {shiftPressed ? <b>Shift ⇧</b> : 'Shift ⇧'}
          </Labeling>
          <Labeling gray>+ click on a node to open it</Labeling>
        </Flex>
      </Flex>
      {selected && <Divider mb="0px" mt="30px" />}
      <Flex padding="10px 0 0 0" justifyContent="center">
        {selected ? (
          <Flex width="100%" justifyContent="space-between">
            <Flex alignItems="center" minHeight="36px">
              <Box
                mr="20px"
                mt={selected.type === EventTarget.node ? '3px' : ''}
                sx={batchStyles(getColor(selected.element.type), selected.type)}
              />
              <Labeling bold mr="20px">
                {selected.element.data.name}
              </Labeling>
              {showExtra && (
                <>
                  {!!selected.element.data.features && (
                    <Labeling
                      bold
                      mr="20px"
                    >{`${selected.element.data.features} features`}</Labeling>
                  )}
                  <Labeling gray>{`last updated ${new Date(
                    selected.element.data.updated,
                  ).toUTCString()}`}</Labeling>
                </>
              )}
            </Flex>
            {showExtra && (
              <User
                name={selected.element.data.owner}
                photo={ProfileService.avatar(
                  String(selected.element.data.owner),
                )}
              />
            )}
          </Flex>
        ) : (
          <Labeling mt="40px" mb="13px" gray>
            Click on a node to get further info
          </Labeling>
        )}
      </Flex>
    </Flex>
  );
};

export default ProvenanceLegend;
