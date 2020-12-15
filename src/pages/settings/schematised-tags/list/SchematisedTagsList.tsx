import { Flex } from 'rebass';
import React, { FC, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types
import { Dispatch } from '../../../../store';
// Components
import Loader from '../../../../components/loader/Loader';
import SchematisedTagsListContent from './SchematisedTagsListContent';
// Selectors
import {
  selectSchematisedTags,
  selectSchematisedTagListLoading,
} from '../../../../store/models/schematised-tags/schematised-tags.selectors';

const SchematisedTagsList: FC = () => {
  const tags = useSelector(selectSchematisedTags);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.schematisedTags.fetch();
  }, [dispatch]);

  const isLoading = useSelector(selectSchematisedTagListLoading);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flex flexGrow={1} flexDirection="column">
      {!isLoading && <SchematisedTagsListContent data={tags} />}
    </Flex>
  );
};

export default memo(SchematisedTagsList);
