import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Button, Subtitle, Labeling } from '@logicalclocks/quartz';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import routeNames from '../../../../routes/routeNames';

export interface NoTDProps {
  handleCreate: () => void;
}

export const NoResults: FC<NoTDProps> = (props: NoTDProps) => {
  const { handleCreate } = props;
  const navigate = useNavigateRelative();

  function handleClickFG() {
    navigate(routeNames.featureGroup.list, 'p/:id/*');
  }

  return (
    <Flex
      flexGrow={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Subtitle>No Training Dataset</Subtitle>
      <Labeling mt="11px" mb="37px">
        Create one from feature groups
      </Labeling>

      <Flex alignItems="center">
        <Button intent="secondary" onClick={handleClickFG}>
          Feature Groups
        </Button>
        <Button intent="primary" ml="20px" onClick={handleCreate}>
          New Training Dataset
        </Button>
      </Flex>
    </Flex>
  );
};
