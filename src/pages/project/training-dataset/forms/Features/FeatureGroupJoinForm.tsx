import { Box } from 'rebass';
import { useFormContext } from 'react-hook-form';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Divider, Value } from '@logicalclocks/quartz';

// Components
import JoinsMessage from './JoinsMessage';
import InnerJoinForm from './InnerJoinForm';
// Types
import { FeatureGroupJoin } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';
import { FeatureGroupBasket } from '../../../../../store/models/localManagement/basket.model';
// Utils
import randomString from '../../../../../utils/randomString';

const FeatureGroupJoinForm: FC<{
  featureGroups: FeatureGroupBasket[];
  isDisabled: boolean;
}> = ({ featureGroups: basketFeatureGroups, isDisabled }) => {
  const { setValue } = useFormContext();

  const initialJoins = (): FeatureGroupJoin[] => {
    const itemTD = localStorage.getItem('TdInfo');

    if (itemTD) {
      return JSON.parse(itemTD).joins || [];
    }

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

      // @ts-ignore
      copy[index][field] = value;

      setJoins(copy);
    },
    [joins],
  );

  useEffect(() => {
    const tdInfo = localStorage.getItem('TdInfo');
    if (tdInfo && JSON.parse(tdInfo).joins) {
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
  }, [mappedFeatureGroups]);

  useEffect(() => {
    setValue('joins', joins);
  }, [joins, setValue]);

  useEffect(() => {
    const infoTD: { [key: string]: string } | any = localStorage.getItem(
      'TdInfo',
    );

    if (infoTD) {
      const newInfoTD = { ...JSON.parse(infoTD), joins };
      localStorage.setItem('TdInfo', JSON.stringify(newInfoTD));
    }
  }, [joins]);

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
