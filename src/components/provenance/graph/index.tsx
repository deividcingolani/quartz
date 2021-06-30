// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useState, useRef, useMemo } from 'react';
import { Flex } from 'rebass';
// Hooks
import { useTheme } from 'emotion-theming';
import useKeyPress from '../../../hooks/useKeyPress';
import useGetHrefForRoute from '../../../hooks/useGetHrefForRoute';
// Components
import ProvenanceNetwork from './provenance-graph';
import ProvenanceLegend, { selectedNode } from './provenance-legend';
// Types
import { ProvenanceGraphProps } from '../types';
// Utils
import { getStrType } from '../utils/graphUtils';
import { colorsMap } from '../utils/utils';

const ProvenanceGraph: FC<ProvenanceGraphProps> = ({
  root,
  panning,
  upstream,
  downstream,
  maxVisibleDepth = Infinity,
  ...props
}: ProvenanceGraphProps) => {
  const [selected, setSelected] = useState<selectedNode | null>(null);

  const shiftRef = useRef(false);
  shiftRef.current = useKeyPress('Shift');

  const getHref = useGetHrefForRoute();

  const theme = useTheme<any>();

  const themedColors = useMemo(() => {
    return Object.keys(colorsMap).reduce((acc, key) => {
      acc[key] = theme.colors.labels[(colorsMap as any)[key]];
      return acc;
    }, {} as any);
  }, [theme.colors.labels]);

  return (
    <Flex {...props} flexDirection="column" width="100%">
      {/* D3 chart */}
      <ProvenanceNetwork
        root={root}
        upstream={upstream}
        downstream={downstream}
        panningEnabled={panning}
        colors={themedColors}
        maxVisibleDepth={maxVisibleDepth}
        onBackdropClick={() => setSelected(null)}
        onClick={({ type, element }) => {
          if (shiftRef.current) {
            const type = getStrType(element.type);
            if (['fg', 'td'].includes(type)) {
              window.open(getHref(`/${type}/${element.id}`, 'p/:id/*'));
            }
          }
          setSelected((selected) => {
            if (selected?.type === type && selected?.element === element) {
              return null;
            }
            return { type, element };
          });
        }}
      />
      {/* Legend */}
      <ProvenanceLegend
        shiftPressed={shiftRef.current}
        colors={themedColors}
        selected={selected}
      />
    </Flex>
  );
};

export default ProvenanceGraph;
