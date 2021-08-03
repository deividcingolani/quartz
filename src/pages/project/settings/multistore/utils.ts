import {
  PermissionTypes,
  ShareableSevices,
} from '../../../../types/multistore';

export const permissionsToLabelMap = {
  [PermissionTypes.READ_ONLY]: 'read-only',
  [PermissionTypes.EDITABLE_BY_OWNERS]: 'data owner edit',
  [PermissionTypes.EDITABLE]: 'full edit',
};

export const permissionsToBadgeVariantMap = {
  [PermissionTypes.READ_ONLY]: 'light',
  [PermissionTypes.EDITABLE_BY_OWNERS]: 'border',
  [PermissionTypes.EDITABLE]: 'label',
} as any;

export const labelToPermissionsMap = {
  [permissionsToLabelMap.READ_ONLY]: PermissionTypes.READ_ONLY,
  [permissionsToLabelMap.EDITABLE_BY_OWNERS]:
    PermissionTypes.EDITABLE_BY_OWNERS,
  [permissionsToLabelMap.EDITABLE]: PermissionTypes.EDITABLE,
};

export const shareableServicesToLabelMap = {
  [ShareableSevices.FEATURESTORE]: 'feature store',
};

export const getDatasetProject = (name: string): string => {
  return name.split('::')[0];
};

export const getDatasetType = (__name: string): string => {
  // TODO: this should parse the different entity names when we share more.
  return 'featurestore';
};
