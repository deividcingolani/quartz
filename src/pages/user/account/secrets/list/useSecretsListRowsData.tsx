import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
// Components
import { Value, Labeling, IconButton, IconName } from '@logicalclocks/quartz';
// Types
import { Secret, SecretsVisibility } from '../../../../../types/secrets';
import { Project } from '../../../../../types/project';

const useSecretListRowData = (
  data: Secret[],
  projects: Project[],
  handleRead: (data: { name: string; secret: string }) => void,
  handleDelete: (data: { name: string; secret: string }) => void,
): any => {
  const getProjectName = useCallback(
    (scope) => projects.find((x) => x.id === scope)?.name || '',
    [projects],
  );

  const getVisibilityContent = useCallback(
    (visibility: string, scope: number) => {
      return visibility === SecretsVisibility.private.toUpperCase() || !projects
        ? visibility.toLowerCase()
        : `${visibility.toLowerCase()}(${getProjectName(scope)})`;
    },
    [getProjectName, projects],
  );

  const groupComponents = useMemo(() => {
    return data.map(() => [Value, Value, Labeling, IconButton, IconButton]);
  }, [data]);

  const groupProps = useMemo(() => {
    return data.map(({ name, visibility, scope, addedOn, secret }) => [
      {
        children: name,
      },
      {
        children: getVisibilityContent(visibility, +scope),
      },
      {
        gray: true,
        children: format(new Date(addedOn), 'yyyy-MM-dd'),
      },
      {
        intent: 'ghost',
        icon: IconName.eye,
        tooltip: 'Read',
        disabled: !secret,
        onClick: () => handleRead({ name, secret }),
      },
      {
        intent: 'ghost',
        icon: IconName.bin,
        tooltip: 'Delete',
        onClick: () => handleDelete({ name, secret }),
      },
    ]);
  }, [data, getVisibilityContent, handleDelete, handleRead]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useSecretListRowData;
