import React, { FC } from 'react';
import { Flex } from 'rebass';
import { Button, Subtitle, Labeling } from '@logicalclocks/quartz';
import useProjectNavigate from '../../../../hooks/useProjectNavigate';
import routeNames from '../../../../routes/routeNames';

interface INoTDProps {
  handleCreate: () => void;
}

export const NoResults: FC<INoTDProps> = (props: INoTDProps) => {
  const { handleCreate } = props;
  const navigate = useProjectNavigate();

  function handleClickFG() {
    navigate(routeNames.featureGroupList);
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
