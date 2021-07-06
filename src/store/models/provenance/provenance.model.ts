import { createModel } from '@rematch/core';
import {
  NodeTypes,
  ProvenanceData,
  ProvenanceNode,
  ProvenanceState,
} from '../../../components/provenance/types';
import { typesMap } from '../../../components/provenance/utils/utils';
import ExperimentsService from '../../../services/project/ExperimentsService';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import ModelsService from '../../../services/project/ModelsService';
import ProvenanceService from '../../../services/project/ProvenanceService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import { FeatureGroup } from '../../../types/feature-group';
import { Direction, Entry } from '../../../types/provenance';
import { TrainingDataset } from '../../../types/training-dataset';

const servicesByTypeMap = {
  TRAINING_DATASET: TrainingDatasetService,
  FEATURE: FeatureGroupsService,
  MODEL: ModelsService,
  EXPERIMENT: ExperimentsService,
} as any;

const inverseDirection = {
  [Direction.out]: Direction.in,
  [Direction.in]: Direction.out,
};

export type Dataset = FeatureGroup | TrainingDataset;

const getRootProvenance = async (projectId: number, data: Dataset) => {
  const rootProvenance = await ProvenanceService.getProvenance({
    projectId,
    datasetName: data.name,
    direction: Direction.in,
    datasetVersion: data.version,
  });

  const items = rootProvenance?.items;

  if (!items || items.length === 0) return null;
  const rootEl = items[0].in.entry[0].value;

  const root = {
    id: data.id,
    name: data.name,
    type: typesMap[rootEl.docSubType],
    data: {
      name: data.name,
      features: data.features.length,
      updated: data.created,
      owner: data.creator,
    },
  } as ProvenanceNode;

  return root;
};

const buildNode = (data: Dataset, ds: Dataset, subtype: string) => {
  const node = {
    id: ds.id,
    name: ds.name,
    type: typesMap[subtype],
    data: {
      name: ds.name,
      features: data?.features?.length
        ? data.features.filter(
            (d) => (d?.featuregroup?.id || (d as any).featureGroupId) === ds.id,
          ).length
        : null,
      updated: ds.created,
      owner: ds.creator,
    },
  } as ProvenanceNode;
  return node;
};

const buildLink = (data: Dataset, ds: Dataset, entry: Entry) => {
  const link = {
    source: data.id,
    target: ds.id,
    type: NodeTypes.link,
    data: {
      name: entry.value.appId,
      features: ds.features?.length,
      updated: entry.value.timestamp,
      owner: ds.creator,
    },
  };
  return link;
};

const getEntryName = (entry: Entry) => {
  return ['MODEL', 'EXPERIMENT'].includes(entry.value.docSubType)
    ? entry.key
    : entry.key.slice(0, entry.key.lastIndexOf('_'));
};

const provenance = createModel()({
  state: {} as ProvenanceState,
  reducers: {
    setProvenance: (
      _: ProvenanceState,
      payload: ProvenanceState,
    ): ProvenanceState => payload,
    clear: () =>
      ({
        upstream: { nodes: [], links: [] },
        downstream: { nodes: [], links: [] },
        root: {} as ProvenanceNode,
        count: 0,
      } as ProvenanceState),
  },
  effects: (__dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      data,
    }: {
      projectId: number;
      featureStoreId: number;
      data: Dataset;
    }): Promise<ProvenanceState> => {
      const getProvenance = async (
        data: Dataset,
        direction: Direction,
        result = { nodes: [], links: [] } as ProvenanceData,
      ): Promise<ProvenanceData> => {
        const provenance = await ProvenanceService.getProvenance({
          projectId,
          direction: inverseDirection[direction],
          datasetName: data.name,
          datasetVersion: data.version,
        });

        const entries = provenance?.items?.reduce(
          (acc: Entry[], item) => [...acc, ...item[direction].entry],
          [],
        ) as Entry[];

        if (entries?.length) {
          await Promise.allSettled(
            entries.map(async (entry) => {
              const dsType = entry.value.docSubType;
              const name = getEntryName(entry);

              const element = await servicesByTypeMap[dsType].getOneByName(
                projectId,
                name,
                featureStoreId,
              );

              const ds = element.length ? element[0] : element;

              const node = buildNode(data, ds, entry.value.docSubType);
              const link = buildLink(data, ds, entry);

              result.nodes.push(node);
              result.links.push(link);

              return getProvenance(ds, direction, result);
            }),
          );
        }
        return result;
      };

      const root = await getRootProvenance(projectId, data);
      if (!root) return {} as ProvenanceState;
      const upstream = await getProvenance(data, Direction.in);
      const downstream = await getProvenance(data, Direction.out);
      const count = upstream.nodes.length + downstream.nodes.length;
      const provenance = { upstream, downstream, root, count };
      return provenance;
    },
  }),
});

export default provenance;
