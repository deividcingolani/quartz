import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Value, Labeling, IconButton, IconName } from '@logicalclocks/quartz';

import { format } from 'date-fns';
import { Api } from '../../../../../types/api';
import { cropText } from '../../../../project/storage-connectors/utils';

const useApiListRowData = (data: Api[], scope: string[]) => {
  const navigate = useNavigate();

  const groupComponents = useMemo(() => {
    return data.map(({ scope: keyScope }) => [
      Value,
      scope.length === keyScope.length ? Labeling : Value,
      Value,
      Labeling,
      Labeling,
      IconButton,
    ]);
  }, [data, scope]);

  const groupProps = useMemo(() => {
    return data.map(({ name, scope: keyScope, prefix, created, modified }) => [
      {
        children: name,
      },
      {
        ...(keyScope.length === scope.length
          ? {
              children: 'full scope',
              gray: true,
            }
          : {
              children: cropText(
                keyScope.map((item) => item.toLowerCase()).join(', '),
                77,
              ),
            }),
      },
      {
        children: prefix,
      },
      {
        gray: true,
        children: format(new Date(created), 'yyyy-MM-dd'),
      },
      {
        gray: true,
        children: format(new Date(modified), 'yyyy-MM-dd'),
      },
      {
        intent: 'ghost',
        icon: IconName.edit,
        tooltip: 'Edit',
        onClick: () => navigate(`/account/api/${name}/edit`),
      },
    ]);
  }, [data, navigate, scope]);

  return useMemo(() => {
    return [groupComponents, groupProps];
  }, [groupComponents, groupProps]);
};

export default useApiListRowData;
