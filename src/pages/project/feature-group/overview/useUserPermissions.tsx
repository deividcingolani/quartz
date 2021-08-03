import { useMemo } from 'react';
// Hooks
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useProject from '../../settings/useProject';
import useSharedFrom from '../../settings/useSharedFrom';
// Types
import { PermissionTypes } from '../../../../types/multistore';
import { RootState } from '../../../../store';
// Selectors
import { selectFeatureStoreData } from '../../../../store/models/feature/selectors';

export interface UseUserPermissions {
  canEdit: boolean;
  isOwnFs: boolean;
  isLoading: boolean;
}

const useUserPermissions = (): UseUserPermissions => {
  const { id: projectId, fsId } = useParams();

  const { project, isLoading: isProjectLoading } = useProject(+projectId);

  const { data: featurestore, isLoading: isFSLoading } = useSelector(
    (state: RootState) => selectFeatureStoreData(state, +fsId),
  );

  const { data: sharedFrom, isLoading: isSharedLoading } = useSharedFrom(
    +projectId,
  );

  const currentUser = useSelector((state: RootState) => state.profile);

  const loadingCurrentUser = useSelector(
    (state: RootState) => state.loading.effects.profile.getUser,
  );

  const canEdit = useMemo(() => {
    let can = true;
    let isOwnFs = false;

    if (!sharedFrom || !featurestore) {
      can = false;
    } else {
      const sharedFS = sharedFrom.find((ds) =>
        ds.projectName.includes(featurestore.projectName),
      );
      isOwnFs = !sharedFS;
      // If the fs belongs to the project we can always edit.
      if (!sharedFS) {
        can = true;
      } else {
        // It it's shared, we check the shared permissions + user permissions.
        const userInTeam = project.projectTeam?.find(
          ({ user }) => user.username === currentUser.username,
        );
        // Cannot edit if READ_ONLY || (DO logged as DS).
        if (
          sharedFS.permission === PermissionTypes.READ_ONLY ||
          (sharedFS.permission === PermissionTypes.EDITABLE_BY_OWNERS &&
            userInTeam?.teamRole === 'Data scientist')
        ) {
          can = false;
        }
      }
    }
    return { can, isOwnFs };
  }, [currentUser.username, featurestore, project.projectTeam, sharedFrom]);

  return {
    canEdit: canEdit.can,
    isOwnFs: canEdit.isOwnFs,
    isLoading:
      isProjectLoading || isSharedLoading || isFSLoading || loadingCurrentUser,
  };
};

export default useUserPermissions;
