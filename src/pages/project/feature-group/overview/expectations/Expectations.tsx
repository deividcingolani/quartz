// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ComponentType,
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Flex } from 'rebass';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Labeling,
  Row,
  TinyPopup,
  Tooltip,
  usePopup,
  Value,
} from '@logicalclocks/quartz';

import ExpectationDrawer from './drawer/ExpectationDrawer';
// Types
import { Dispatch, RootState } from '../../../../../store';
import { FeatureGroup } from '../../../../../types/feature-group';
// Hooks
import useDrawer from '../../../../../hooks/useDrawer';
import useExpectationsListRowData from './useExpectationsListRowData';

// styles
import icons from '../../../../../sources/icons';
import routeNames from '../../../../../routes/routeNames';
import expectationListStyles from './expectationListStyles';

// utils
import renderValidationType from './utils';
import getHrefNoMatching from '../../../../../utils/getHrefNoMatching';

export interface ExpectationsProps {
  data: FeatureGroup;
  isOwnFs: boolean;
}

const Expectations: FC<ExpectationsProps> = ({ data, isOwnFs }) => {
  const { id: projectId, fsId, fgId } = useParams();

  const { handleSelectItem, handleClose, isOpen, selectedId } =
    useDrawer<string>();

  const [isPopupOpen, handleToggle] = usePopup();

  const dispatch = useDispatch<Dispatch>();

  const [nameToDelete, setName] = useState<string>();

  const onDeleteItem = useCallback(
    (name: string) => () => {
      setName(name);
      handleToggle();
    },
    [handleToggle],
  );

  const handleDelete = () => {
    if (nameToDelete) {
      dispatch.expectations.detach({
        projectId: +projectId,
        featureStoreId: +fsId,
        featureGroupId: data.id,
        name: nameToDelete,
      });

      handleToggle();
    }
  };

  const [groupComponents, groupProps] = useExpectationsListRowData(
    data,
    handleSelectItem,
    onDeleteItem,
  );

  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (id: number, route: string) => (): void => {
      navigate(
        getHrefNoMatching(route, routeNames.project.value, true, {
          fgId: id,
          id: projectId,
          fsId,
        }),
      );
    },
    [navigate, projectId, fsId],
  );

  const isLoading = useSelector(
    (state: RootState) =>
      state.loading.effects.featureGroupView.loadRemainingData,
  );

  const action = useMemo(
    () => (
      <Button
        p={0}
        intent="inline"
        href={getHrefNoMatching(
          routeNames.featureGroup.activityValidations,
          routeNames.project.value,
          true,
          { id: projectId, fsId, fgId },
        )}
        onClick={handleNavigate(
          +fgId,
          routeNames.featureGroup.activityValidations,
        )}
      >
        see data validation activity
      </Button>
    ),
    [handleNavigate, fgId, fsId, projectId],
  );

  const title = useMemo(
    () => (
      <Flex>
        <Value lineHeight="27px" fontSize="18px">
          Expectations
        </Value>
        <Tooltip mt="2px" ml="3px" mainText="Add requirements to features">
          {icons.info_block}
        </Tooltip>
      </Flex>
    ),
    [],
  );

  if (isLoading) {
    return (
      <Card mt="20px" title={title} actions={action}>
        <Box mt="20px" mx="-20px">
          <Flex height="50px" mt="30px" justifyContent="center">
            <Labeling fontSize="18px" gray>
              Loading...
            </Labeling>
          </Flex>
        </Box>
      </Card>
    );
  }

  if (!data.expectations?.length) {
    return (
      <Card mt="20px" title={title} actions={action}>
        <Box mt="10px">
          <Flex flexDirection="column" alignItems="center">
            <Labeling fontSize="18px" gray>
              No expectation attached
            </Labeling>
            <Tooltip
              mt="20px"
              disabled={!!data.features.length && isOwnFs}
              mainText={
                !isOwnFs
                  ? "Can't edit expectations of shared feature groups"
                  : "Can't add an expectation without features"
              }
            >
              <Button
                disabled={!data.features.length || !isOwnFs}
                onClick={handleNavigate(data.id, routeNames.expectation.attach)}
              >
                Attach an expectation
              </Button>
            </Tooltip>
          </Flex>
        </Box>
      </Card>
    );
  }

  return (
    <>
      <TinyPopup
        width="440px"
        isOpen={isPopupOpen}
        onClose={handleToggle}
        title="Detach expectation"
        secondaryButton={['Back', handleToggle]}
        mainButton={['Detach expectation', handleDelete]}
        secondaryText="Detach the expectation from the feature group"
      />
      {!!selectedId && (
        <ExpectationDrawer
          data={data}
          isOpen={isOpen}
          name={selectedId}
          handleToggle={handleClose}
        />
      )}
      <Card mt="20px" title={title} actions={action}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <Value primary>{data.expectations?.length}</Value>
            <Labeling bold ml="5px" mr="5px">
              {data.expectations?.length > 1 ? 'expectations' : 'expectation'}
              {renderValidationType(data.validationType)}
            </Labeling>
          </Flex>
          <Tooltip
            disabled={!!data.features.length}
            mainText={
              !isOwnFs
                ? "Can't edit expectations of shared feature groups"
                : "Can't add an expectation without features"
            }
          >
            <Button
              disabled={!data.features.length || !isOwnFs}
              onClick={handleNavigate(data.id, routeNames.expectation.attach)}
            >
              Attach an expectation
            </Button>
          </Tooltip>
        </Flex>

        <Box mt="20px" sx={expectationListStyles}>
          <Row
            onRowClick={(_, index) => {
              const { name } = data.expectations[index];

              handleSelectItem(name)();
            }}
            legend={['name', 'last validation', 'rules', 'features concerned']}
            middleColumn={3}
            groupComponents={groupComponents as ComponentType<any>[][]}
            groupProps={groupProps}
          />
        </Box>
      </Card>
    </>
  );
};

export default Expectations;
