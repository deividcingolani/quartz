// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { Box, Flex } from 'rebass';
import { Card, Labeling } from '@logicalclocks/quartz';
// Hooks
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Types
import { RootState } from '../../store';
import { ProvenanceState } from './types';
// Components
import ProvenanceGraph from './graph';

export interface FeatureListProps {
  provenance: ProvenanceState;
  rootId: number;
}

const Provenance: FC<FeatureListProps> = ({ provenance }) => {
  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.provenance.fetch,
  );

  /* ------------------------------------------------------------------------ */
  // TODO: (gonzalo) remove when provenance for shared fs is ready.
  const { fsId } = useParams();
  const featurestore = useSelector((state: RootState) =>
    state.featureStores?.length ? state.featureStores[0] : null,
  );
  const isOwnFS = featurestore?.featurestoreId === +fsId;
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <Card mt="20px" title="Provenance">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              Loading...
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  if (!provenance?.count) {
    return (
      <Card mt="20px" title="Provenance">
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              {isOwnFS
                ? 'There is no provenance to be shown'
                : 'Provenance is not available in shared feature stores'}
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <Card mt="20px" title="Provenance">
      <Flex justifyContent="center" mt="10px">
        <ProvenanceGraph
          root={provenance.root}
          upstream={provenance.upstream}
          downstream={provenance.downstream}
          panning={false}
        />
      </Flex>
    </Card>
  );
};

export default memo(Provenance);
