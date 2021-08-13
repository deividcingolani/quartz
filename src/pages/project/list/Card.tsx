// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import {
  Value,
  Button,
  Labeling,
  FreshnessBar,
  Microlabeling,
  HoverableText,
  Card as QuartzCard,
  Tooltip,
  TinyPopup,
  usePopup,
  User,
  Badge,
  Input,
} from '@logicalclocks/quartz';
import formatDistance from 'date-fns/formatDistance';
import { Box, Flex } from 'rebass';

// Types
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Project } from '../../../types/project';
// Hooks
import useNavigateRelative from '../../../hooks/useNavigateRelative';

import routeNames from '../../../routes/routeNames';
import { Dispatch, RootState } from '../../../store';
import getInputValidation from '../../../utils/getInputValidation';
import { shortText } from '../../../utils/validators';

export interface CardProps {
  data: Project;
}

const Card: FC<CardProps> = ({ data }: CardProps) => {
  const navigate = useNavigateRelative();
  const dispatch = useDispatch<Dispatch>();

  const [isDescriptionPopupOpen, handleDescriptionToggle] = usePopup();

  const [project, setProject] = useState(data);

  const handleNavigate = useCallback(
    (route: string) => () => {
      navigate(route.replace(':id', project.id.toString()));
    },
    [navigate, project],
  );

  const isSubmitting = useSelector(
    (state: RootState) => state.loading.effects.project.edit,
  );

  const schema = yup.object().shape({
    description: shortText.label('Description'),
  });

  const { errors, register, handleSubmit } = useForm({
    defaultValues: { description: project?.description },
    resolver: yupResolver(schema),
    shouldUnregister: false,
  });

  const handleAddDescription = useCallback(
    async ({ description }: { description: string }) => {
      await dispatch.project.edit({
        data: {
          retentionPeriod: '',
          services: [],
          description,
        },
        id: +project.id,
      });
      setProject({ ...project, description });
      handleDescriptionToggle();
    },
    [dispatch.project, project, handleDescriptionToggle],
  );

  const isDemo = useMemo(() => project.name.includes('demo_'), [project]);

  return (
    <>
      <TinyPopup
        width="440px"
        isOpen={isDescriptionPopupOpen}
        onClose={handleDescriptionToggle}
        disabledMainButton={isSubmitting}
        disabledSecondaryButton={isSubmitting}
        closeOnBackdropClick={!isSubmitting}
        secondaryButton={['Back', handleDescriptionToggle]}
        mainButton={['Save', handleSubmit(handleAddDescription)]}
        title="Create description"
        secondaryText=""
      >
        <Input
          label="Description"
          name="description"
          width="100%"
          ref={register}
          placeholder="Enter description to create it"
          {...getInputValidation('description', errors)}
        />
        <Box mb="20px" />
      </TinyPopup>
      <QuartzCard mb="20px" key={project.id}>
        <Flex my="6px" flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              {isDemo && <Badge mr="20px" value="demo" variant="bold" />}
              <HoverableText
                fontFamily="Inter"
                onClick={handleNavigate(routeNames.project.viewHome)}
                fontSize="20px"
              >
                {project.name}
              </HoverableText>

              <Value
                mt="auto"
                ml="5px"
                mr="15px"
                sx={{ color: 'labels.green' }}
              >
                #{project.id}
              </Value>
            </Flex>
            <Flex>
              <Button onClick={handleNavigate(routeNames.project.viewHome)}>
                Open project
              </Button>
            </Flex>
          </Flex>
          {project.description ? (
            <Labeling mt="15px" gray>
              {project.description}
            </Labeling>
          ) : (
            <Button
              variant="inline"
              p="0"
              mt="15px"
              onClick={handleDescriptionToggle}
            >
              + add a description
            </Button>
          )}

          <Flex mt="15px" alignItems="center">
            <Flex flexDirection="column">
              <Microlabeling mb="3px" gray>
                Feature Groups
              </Microlabeling>
              <Value primary>{project.featureGroupsCount}</Value>
            </Flex>
            <Flex flexDirection="column" ml="30px">
              <Microlabeling mb="3px" gray>
                Training Datasets
              </Microlabeling>
              <Value primary>{project.trainingDatasetsCount}</Value>
            </Flex>
            <Flex width="max-content" flexDirection="column" ml="30px">
              <Microlabeling gray mb="3px" width="100%">
                Last updated
              </Microlabeling>
              <Flex alignItems="center">
                <FreshnessBar time={project.created.replace('T', ' ')} />
                <Value fontFamily="Inter" ml="5px" primary>
                  {formatDistance(new Date(project.created), new Date())} ago
                </Value>
              </Flex>
            </Flex>
            <Tooltip
              ml="40px"
              mt="10px"
              mainText={project.user.email}
              secondaryText="author"
            >
              <User
                firstName={project.user.firstname}
                lastName={project.user.lastname}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </QuartzCard>
    </>
  );
};

export default memo(Card);
