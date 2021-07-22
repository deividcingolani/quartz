// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box } from 'rebass';
import { useFormContext } from 'react-hook-form';
import { Divider, Value } from '@logicalclocks/quartz';
// Hooks
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Components
import JoinsMessage from './JoinsMessage';
import InnerJoinForm from './InnerJoinForm';
// Types
import { FeatureGroupJoin } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';
import { FeatureGroupBasket } from '../../../../../services/localStorage/BasketService';
// Utils
import randomString from '../../../../../utils/randomString';
import TdInfoService from '../../../../../services/localStorage/TdInfoService';
import { RootState } from '../../../../../store';

const FeatureGroupJoinForm: FC<{
  featureGroups: FeatureGroupBasket[];
  isDisabled: boolean;
}> = ({ featureGroups: basketFeatureGroups, isDisabled }) => {
  const { setValue } = useFormContext();

  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const initialJoins = (): FeatureGroupJoin[] => {
    const td = TdInfoService.getInfo({
      userId,
      projectId: +projectId,
    });
    if (!td) {
      return [];
    }
    delete td.joins;
    TdInfoService.setInfo({
      userId,
      projectId: +projectId,
      data: td,
    });
    return [];
  };

  const [joins, setJoins] = useState<FeatureGroupJoin[]>(initialJoins());

  const mappedFeatureGroups = useMemo(
    () =>
      basketFeatureGroups.reduce((acc: FeatureGroup[], { fg }) => {
        if (!acc.find(({ id }) => id === fg.id)) {
          return [...acc, fg];
        }
        return acc;
      }, []),
    [basketFeatureGroups],
  );

  const options = useMemo(() => {
    const alreadyPickedNames = joins.reduce(
      (acc: string[], { firstFg, secondFg }) => [
        ...acc,
        ...(firstFg ? [firstFg.name] : []),
        ...(secondFg ? [secondFg.name] : []),
      ],
      [],
    );

    return mappedFeatureGroups.filter(
      ({ name }) => !alreadyPickedNames.includes(name),
    );
  }, [mappedFeatureGroups, joins]);

  const handleChange = useCallback(
    (index: number, field: string, value: any) => {
      const copy = joins.slice();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      copy[index][field] = value;

      setJoins(copy);
    },
    [joins],
  );

  useEffect(() => {
    const tdInfo = TdInfoService.getInfo({ userId, projectId: +projectId });
    if (tdInfo?.joins) {
      return;
    }

    if (mappedFeatureGroups.length >= 1) {
      const joinsFromFgs = new Array(
        // For single feature groups we need at least
        // a join object to work (with only the firstFg populated)
        Math.max(mappedFeatureGroups.length - 1, 1),
      )
        .fill(0)
        .map(() => ({
          id: randomString(),
          firstFgJoinKeys: [[]],
          secondFgJoinKeys: [[]],
          ...(mappedFeatureGroups.length === 1 && {
            firstFg: mappedFeatureGroups[0],
          }),
          ...(mappedFeatureGroups.length === 2 && {
            firstFg: mappedFeatureGroups[0],
            secondFg: mappedFeatureGroups[1],
          }),
        }));
      setJoins(joinsFromFgs);
    }
  }, [mappedFeatureGroups, projectId, userId]);

  useEffect(() => {
    setValue('joins', joins);
  }, [joins, setValue]);

  useEffect(() => {
    const infoTD: { [key: string]: string } | any = TdInfoService.getInfo({
      userId,
      projectId: +projectId,
    });

    if (infoTD) {
      const newInfoTD = { ...infoTD, joins };
      TdInfoService.setInfo({
        userId,
        projectId: +projectId,
        data: newInfoTD,
      });
    }
  }, [joins, projectId, userId]);

  return (
    <>
      {mappedFeatureGroups.length > 1 && (
        <>
          <Divider mt="0" ml="0" width="100%" />

          <Box>
            <Value>Feature group joins</Value>

            <JoinsMessage joins={joins} />

            <InnerJoinForm
              items={joins}
              options={options}
              isDisabled={isDisabled}
              handleChange={handleChange}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default FeatureGroupJoinForm;
