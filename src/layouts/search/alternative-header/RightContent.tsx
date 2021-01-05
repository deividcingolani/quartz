import { Flex } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Labeling, Select, Value } from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../store';

const RightContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  const projects = useSelector((state: RootState) => state.projectsList);

  const { projectId, searchText, type } = useMemo(() => {
    const { pathname: path } = location;
    const [, , projectId] = path.match(/(p)\/(\d+)/) || [];
    const [, , searchText] = path.match(/(features|td|fg)\/(.*)/) || [];
    const type = path.includes('features')
      ? 'features'
      : path.includes('td')
      ? 'td'
      : path.includes('fg')
      ? 'fg'
      : 'features';

    return {
      projectId: +projectId,
      searchText,
      type,
    };
  }, [location]);

  const currentProject = useMemo(
    () => projects.find(({ id }) => id === projectId)?.name || 'all projects',
    [projects, projectId],
  );

  const handleProjectChange = useCallback(
    (value) => {
      const isAll = value[0] === 'all';

      if (isAll) {
        navigate(`search/${type}${searchText ? `/${searchText}` : ''}`);
      } else {
        const id = projects.find(({ name }) => name === value[0])?.id;

        navigate(`search/p/${id}/${type}${searchText ? `/${searchText}` : ''}`);
      }
    },
    [searchText, navigate, type, projects],
  );

  const TopContent: React.ReactElement = searchText ? (
    <Flex mt="5px">
      <Labeling gray>initial search</Labeling>
      <Value ml="5px">{searchText}</Value>
    </Flex>
  ) : (
    <></>
  );

  const BottomContent: React.ReactElement = (
    <Select
      mt="-20px"
      height="fit-content"
      placeholder="scope"
      options={projects.map(({ name }) => name)}
      value={[currentProject]}
      onChange={handleProjectChange}
      bottomActionText="Search across all projects"
      bottomActionHandler={() => handleProjectChange(['all'])}
    />
  );

  return {
    TopContent,
    BottomContent,
  };
};

export default RightContent;
