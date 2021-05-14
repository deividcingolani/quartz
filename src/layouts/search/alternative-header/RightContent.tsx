import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Select } from '@logicalclocks/quartz';

// Types
import { Dispatch, RootState } from '../../../store';

import useQueryParams from '../../../pages/search/hooks/useQueryParams';

export enum MatchOptions {
  name = 'name',
  description = 'description',
  author = 'author',
  tags = 'tags',
}

const RightContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const queryParams = useQueryParams();

  useEffect(() => {
    dispatch.projectsList.getProjects();
  }, [dispatch]);

  const projects = useSelector((state: RootState) => state.projectsList);

  const { projectId, searchText, type, match } = useMemo(() => {
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
      match: queryParams,
    };
  }, [location, queryParams]);

  const currentProject = useMemo(
    () => projects.find(({ id }) => id === projectId)?.name || 'all projects',
    [projects, projectId],
  );

  const handleProjectChange = useCallback(
    (value) => {
      const isAll = value[0] === 'all';
      const matches = location.search;
      if (isAll) {
        navigate(
          `search/${type}${searchText ? `/${searchText}` : ''}${matches}`,
        );
      } else {
        const id = projects.find(({ name }) => name === value[0])?.id;

        navigate(
          `search/p/${id}/${type}${
            searchText ? `/${searchText}` : ''
          }${matches}`,
        );
      }
    },
    [location.search, navigate, type, searchText, projects],
  );

  const handleMatchChange = (matches: any) => {
    const { pathname } = location;
    const queryParams = matches.map((v: any) => `match=${v}`).join('&');
    navigate(`${pathname}${matches.length > 0 ? `?${queryParams}` : ''}`);
  };

  return (
    <>
      <Select
        mt="5px"
        isMulti
        minWidth="180px"
        mr="10px"
        ml="5px"
        placeholder="match on"
        value={(match as any) || Object.values(MatchOptions)}
        options={Object.values(MatchOptions)}
        onChange={handleMatchChange}
      />
      <Select
        mt="5px"
        minWidth="180px"
        placeholder="scope"
        options={projects.map(({ name }) => name)}
        value={[currentProject]}
        onChange={handleProjectChange}
        bottomActionText="Search across all projects"
        bottomActionHandler={() => handleProjectChange(['all'])}
      />
    </>
  );
};

export default RightContent;
