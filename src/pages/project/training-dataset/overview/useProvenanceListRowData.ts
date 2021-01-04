import { useMemo } from 'react';
import { Value, IconButton, Labeling } from '@logicalclocks/quartz';

// Hooks
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
// Types
import { Project } from '../../../../types/project';
// Utils
import { cropText } from '../../sources/utils';
import { TrainingDatasetProvenance } from '../../../../types/training-dataset';

const useProvenanceListRowData = (
  provenance: TrainingDatasetProvenance[],
  { projectName: currentName }: Project,
) => {
  const navigate = useNavigateRelative();

  const needProjectColumn = useMemo(
    () =>
      !!provenance?.find(({ info }) => info.value.projectName !== currentName),
    [currentName, provenance],
  );

  const groupComponents = useMemo(() => {
    return provenance?.map(() => [
      Value,
      Labeling,
      ...(needProjectColumn ? [Value] : [() => null]),
      Value,
      Value,
      IconButton,
    ]);
  }, [provenance, needProjectColumn]);

  const groupProps = useMemo(() => {
    return provenance?.map(
      ({
        fg: { name, features, version, id },
        info: {
          value: { projectName },
        },
      }) => [
        {
          children: name,
        },
        {
          children: `v${version}`,
          bold: true,
          gray: true,
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
            120,
          ),
          fontFamily: 'Inter',
        },
        {
          intent: 'ghost',
          icon: 'search',
          tooltip: 'Open feature group',
          onClick: () => navigate(`/fg/${id}`, 'p/:id/*'),
        },
      ],
    );
  }, [provenance, navigate, currentName, needProjectColumn]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useProvenanceListRowData;
