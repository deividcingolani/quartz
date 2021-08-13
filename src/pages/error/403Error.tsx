// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useEffect } from 'react';
import { User, Value } from '@logicalclocks/quartz';
import { Flex } from 'rebass';
// Hooks
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Error from '../../components/error/Error';
import Loader from '../../components/loader/Loader';
// Types
import { RootState, Dispatch } from '../../store';

const Error403: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<Dispatch>();

  const project = useSelector((state: RootState) => state.crossProject);
  const { firstname } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch.crossProject.getCrossUserProject(+id);
  }, [dispatch, id]);

  return !firstname || !project?.owner ? (
    <Loader />
  ) : (
    <Error
      errorTitle="403"
      errorMessage={`Sorry ${firstname}, you are not invited.`}
    >
      <Flex flexDirection="column" alignItems="center">
        <User
          firstName={project.owner.fname}
          lastName={project.owner.lname}
          secondaryText={project.owner.email}
          isTooltipActive={false}
        />
        <Value mt="8px">{`You are not a member of ${project.name},\
        created by ${project.owner.fname} ${project.owner.lname}`}</Value>
      </Flex>
    </Error>
  );
};

export default memo(Error403);
