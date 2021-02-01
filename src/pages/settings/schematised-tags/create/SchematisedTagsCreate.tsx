import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationsManager } from '@logicalclocks/quartz';
import React, { useCallback, useEffect, useState } from 'react';

// Components
import SchematisedTagsForm from '../forms/SchematisedTagsForm';
import Loader from '../../../../components/loader/Loader';
// Types
import { Dispatch } from '../../../../store';
import { SchematisedTagFormData } from '../forms/types';
// Selectors
import {
  selectSchematisedTagCreate,
  selectSchematisedTags,
} from '../../../../store/models/schematised-tags/schematised-tags.selectors';
// Utils
import { mapProperties } from '../utils';
import NotificationTitle from '../../../../utils/notifications/notificationBadge';
import NotificationContent from '../../../../utils/notifications/notificationValue';

const SchematisedTagsCreate: FC = () => {
  const isLoading = useSelector(selectSchematisedTagCreate);

  const tags = useSelector(selectSchematisedTags);

  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  const dispatch = useDispatch<Dispatch>();

  const handleSubmit = useCallback(
    async (data: SchematisedTagFormData) => {
      // Clear error
      setError(() => '');
      // Check if name already exists
      const { name } = data;
      const exists = !!tags.find(({ name: tagName }) => tagName === name);

      if (exists) {
        setError(() => 'Name already exists');
        return;
      }

      const { properties, ...restData } = data;

      await dispatch.schematisedTagView.create({
        data: {
          ...restData,
          ...mapProperties(properties),
        },
      });

      NotificationsManager.create({
        isError: false,
        type: <NotificationTitle message="New template created" />,
        content: (
          <NotificationContent message={`${restData.name} has been added`} />
        ),
      });

      dispatch.schematisedTags.clear();

      navigate('/settings');
    },
    [dispatch, navigate, tags],
  );

  useEffect(() => {
    dispatch.schematisedTags.fetch();
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SchematisedTagsForm
      error={error}
      onSubmit={handleSubmit}
      isDisabled={false}
    />
  );
};

export default SchematisedTagsCreate;
