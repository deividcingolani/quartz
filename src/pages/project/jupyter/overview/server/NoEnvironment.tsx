// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { Flex } from 'rebass';
import { Value, Button, Labeling } from '@logicalclocks/quartz';
// Hooks
import useNavigateRelative from '../../../../../hooks/useNavigateRelative';

export interface NoEnvironmentProps {
  missingLibraries: string[];
}

const NoEnvironment: FC<NoEnvironmentProps> = ({ missingLibraries }) => {
  const navigate = useNavigateRelative();

  const handleNavigate = useCallback(() => {
    navigate(`/python`, '/p/:id/*');
  }, [navigate]);

  return (
    <Flex flexDirection="column" alignItems="center" my="auto">
      <Value fontFamily="Inter" fontSize="18px" mb="20px">
        Missing Python libraries
      </Value>
      <Flex flexDirection="row">
        <Labeling mb="20px">
          {`The following librarie${
            missingLibraries.length === 1 ? '' : 's'
          } need${
            missingLibraries.length === 1 ? 's' : ''
          } to be installed to run Jupyter:`}
        </Labeling>
        {missingLibraries.map((lib, idx) => (
          <Labeling key={lib} bold>
            &nbsp;
            {lib}
            {idx === missingLibraries.length - 1 ? '.' : ','}
          </Labeling>
        ))}
      </Flex>
      <Button intent="secondary" onClick={handleNavigate}>
        Go to library installer
      </Button>
    </Flex>
  );
};

export default NoEnvironment;
