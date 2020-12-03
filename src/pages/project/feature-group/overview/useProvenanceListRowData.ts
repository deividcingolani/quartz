import { useCallback, useMemo } from 'react';
import { Value, IconButton } from '@logicalclocks/quartz';

// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import { FeatureGroupProvenance } from '../../../../types/feature-group';
import { Project } from '../../../../types/project';
// Utils
import { cropText } from '../../sources/utils';

const useProvenanceListRowData = (
  provenance: FeatureGroupProvenance[],
  { projectName: currentName }: Project,
) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(
    (route: string) => (): void => {
      navigate(route, 'p/:id');
    },
    [navigate],
  );

  const needProjectColumn = useMemo(
    () =>
      !!provenance.find(({ info }) => info.value.projectName !== currentName),
    [currentName, provenance],
  );

  const groupComponents = useMemo(() => {
    return provenance.map(() => [
      Value,
      ...(needProjectColumn ? [Value] : [() => null]),
      Value,
      Value,
      IconButton,
    ]);
  }, [provenance, needProjectColumn]);

  const groupProps = useMemo(() => {
    return provenance.map(
      ({
        td: { name, features },
        info: {
          value: { projectName },
        },
      }) => [
        {
          children: name,
        },
        needProjectColumn && projectName !== currentName
          ? {
              children: projectName,
            }
          : {},
        {
          children: `${features.length} features`,
          primary: true,
        },
        {
          children: cropText(
            features
              .reduce((acc: string[], { name }) => [...acc, name], [])
              .join(', '),
            145,
          ),
          fontFamily: 'Inter',
        },
        {
          intent: 'ghost',
          icon: 'search',
          tooltip: 'Training Dataset',
          onClick: handleNavigate(`/td/${name}`),
        },
      ],
    );
  }, [provenance, handleNavigate, currentName, needProjectColumn]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useProvenanceListRowData;
