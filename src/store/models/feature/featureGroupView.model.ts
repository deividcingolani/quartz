import { createModel } from '@rematch/core';

// Types
import { ActivityItemData, FeatureGroup } from '../../../types/feature-group';
import { ActivityTypeSortOptions } from '../../../pages/project/feature-group/activity/types';
// Services
import ExpectationService from '../../../services/project/ExpectationService';
import FeatureGroupsService from '../../../services/project/FeatureGroupsService';
import TrainingDatasetService from '../../../services/project/TrainingDatasetService';
import FeatureGroupLabelsService from '../../../services/project/FeatureGroupLabelsService';
import { Expectation } from '../../../types/expectation';
import { getValidPromisesValues } from '../search/deep-search.model';

export type FeatureGroupViewState = FeatureGroup | null;

const featureGroupView = createModel()({
  state: null as FeatureGroupViewState,
  reducers: {
    setData: (
      _: FeatureGroupViewState,
      payload: FeatureGroup,
    ): FeatureGroupViewState => payload,
    setLabels: (state: FeatureGroupViewState, payload: string[]): any => ({
      ...state,
      labels: payload,
    }),
    clear: () => null,
    deleteExpectation: (
      state: FeatureGroupViewState,
      payload: string,
    ): FeatureGroupViewState =>
      ({
        ...state,
        expectations: state?.expectations
          .slice()
          .filter(({ name }) => name !== payload),
      } as FeatureGroupViewState),
  },
  effects: (dispatch) => ({
    fetch: async ({
      projectId,
      featureStoreId,
      featureGroupId,
      needMore = true,
      needExpectation = false,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      needMore?: boolean;
      needExpectation?: boolean;
    }): Promise<void> => {
      const data = await FeatureGroupsService.get(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      let expectations: Expectation[] = [];
      if (needExpectation) {
        expectations = await ExpectationService.getList(
          projectId,
          featureStoreId,
          featureGroupId,
        );
      }

      const mapped = {
        ...data,
        provenance: [],
        labels: [],
        tags: [],
        commits: [],
        versions: [{ id: data.id, version: data.version }],
        expectations,
      };
      dispatch.featureGroupView.setData(mapped);

      if (needMore) {
        dispatch.featureGroupView.loadRemainingData({
          data: mapped,
          projectId,
          featureStoreId,
          featureGroupId,
          needExpectations: !needExpectation,
        });
      }
    },
    fetchByName: async ({
      projectId,
      featureStoreId,
      featureGroupName,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupName: string;
    }): Promise<void> => {
      const [data] = await FeatureGroupsService.getByName(
        projectId,
        featureStoreId,
        featureGroupName,
      );

      dispatch.featureGroupView.setData({
        ...data,
        provenance: [],
        labels: [],
        tags: [],
        commits: [],
        versions: [{ id: data.id, version: data.version }],
        expectations: [],
      });
    },
    loadRemainingData: async ({
      data,
      projectId,
      featureGroupId,
      featureStoreId,
      needExpectations,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
      data: FeatureGroup;
      needExpectations: boolean;
    }) => {
      /* KEYWORDS */
      let keywords: string[] = [];
      if (data.type === 'cachedFeaturegroupDTO') {
        keywords = await FeatureGroupLabelsService.getList(
          projectId,
          featureStoreId,
          featureGroupId,
        );
      }
      /* PROVENANCE */
      const { data: provenance } = await FeatureGroupsService.getProvenance(
        projectId,
        featureStoreId,
        data,
      );

      const entries =
        provenance.items && provenance.items.map(({ out }) => out.entry[0]);

      let fgProvenances = [];

      if (entries) {
        dispatch.project.getProject(projectId);

        const fgProvenancesPromises = await Promise.allSettled(
          entries.map(async (entry) => {
            const { key } = entry;
            const [td] = await TrainingDatasetService.getOneByName(
              projectId,
              featureStoreId,
              key.slice(0, key.lastIndexOf('_')),
            );
            return {
              td,
              info: entry,
            };
          }),
        );
        fgProvenances = fgProvenancesPromises.reduce((acc: any[], next) => {
          if (next.status === 'fulfilled') {
            return [...acc, next.value];
          }
          return acc;
        }, []);
      }
      /* TAGS */
      const { data: tags } = await FeatureGroupsService.getTags(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      const mappedTags = tags?.items?.map(({ name, value, schema }: any) => {
        const tags = JSON.parse(value);
        const { properties }: SchemaType = JSON.parse(schema.value);

        return {
          name,
          tags,
          types: Object.entries(properties).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]:
                value.type === 'array'
                  ? `Array of ${value.items.type}`
                  : value.type,
            }),
            {},
          ),
        };
      });
      /* SAME NAME */
      const fgsWithSameName = await FeatureGroupsService.getOneByName(
        projectId,
        featureStoreId,
        data.name,
      );
      /* COMMITS */
      let commits: any = [];
      if (data.timeTravelFormat !== 'NONE') {
        const commitsData = await FeatureGroupsService.getCommitsDetail(
          projectId,
          featureStoreId,
          featureGroupId,
          100,
        );
        commits = commitsData.data;
      }
      /* EXPECTATIONS */
      let expectations = data.expectations;
      if (needExpectations) {
        const serverExpectations = await ExpectationService.getList(
          projectId,
          featureStoreId,
          featureGroupId,
        );

        const promises = await Promise.allSettled(
          serverExpectations.map(async (expectation) => {
            const {
              data: attachedFGs,
            } = await ExpectationService.getAttachedFeatureGroups(
              projectId,
              featureStoreId,
              expectation.name,
            );

            return { ...expectation, attachedFeatureGroups: attachedFGs || [] };
          }),
        );

        expectations = getValidPromisesValues(promises);
      }

      const validation = await ExpectationService.getValidations(
        projectId,
        featureStoreId,
        featureGroupId,
      );

      dispatch.featureGroupView.setData({
        ...data,
        provenance: fgProvenances,
        labels: keywords,
        commits: commits.items || [],
        tags: mappedTags || [],
        versions: fgsWithSameName.map(({ id, version }) => ({ id, version })),
        expectations,
        lastValidation: validation,
      });
    },
    updateLabels: ({ labels }: { labels: string[] }) => {
      dispatch.featureGroupView.setLabels(labels);
    },
    fetchLastJobs: async ({
      projectId,
      featureStoreId,
      featureGroupId,
    }: {
      projectId: number;
      featureStoreId: number;
      featureGroupId: number;
    }): Promise<ActivityItemData[]> => {
      const { data } = await FeatureGroupsService.getActivity(
        projectId,
        featureStoreId,
        featureGroupId,
        ActivityTypeSortOptions.JOB,
      );

      return data.items || [];
    },
  }),
});

export interface SchemaType {
  properties: {
    [key: string]: {
      type: string;
      items: {
        type: string;
      };
    };
  };
}

export default featureGroupView;
