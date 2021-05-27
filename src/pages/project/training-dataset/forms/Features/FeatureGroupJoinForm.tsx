import { Box } from 'rebass';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Value } from '@logicalclocks/quartz';

// Components
import JoinsMessage from './JoinsMessage';
import InnerJoinForm from './InnerJoinForm';
// Types
import { FeatureGroupJoin } from '../../types';
import { FeatureGroup } from '../../../../../types/feature-group';
import { selectFeatureGroupsData } from '../../../../../store/models/feature/selectors';
import { FeatureGroupBasket } from '../../../../../store/models/localManagement/basket.model';
// Utils
import randomString from '../../../../../utils/randomString';

const FeatureGroupJoinForm: FC<{
  featureGroups: FeatureGroupBasket[];
  isDisabled: boolean;
}> = ({ featureGroups: basketFeatureGroups, isDisabled }) => {
  const { setValue } = useFormContext();

  const initialJoins = ():FeatureGroupJoin[] => {
    const itemTD = localStorage.getItem('info');

    if(itemTD){
      return JSON.parse(itemTD).joins || [];
    }

    return [];
  }

  const [joins, setJoins] = useState<FeatureGroupJoin[]>(initialJoins());

  const featureGroups = useSelector(selectFeatureGroupsData).data;

  const mappedFeatureGroups = useMemo(
    () =>
      basketFeatureGroups.reduce((acc: FeatureGroup[], { fg }) => {
        const featureGroup = featureGroups.find(({ id }) => id === fg.id);

        return featureGroup ? [...acc, featureGroup] : acc;
      }, []),
    [featureGroups, basketFeatureGroups],
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
    if(localStorage.getItem('info')){
      return;
    }
    
    if (mappedFeatureGroups.length >= 1) {
      const joinsFromFgs = new Array(mappedFeatureGroups.length - 1)
        .fill(0)
        .map(() => ({
          id: randomString(),
          firstFgJoinKeys: [[]],
          secondFgJoinKeys: [[]],
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


  useEffect(()=>{
    const infoTD: { [key: string]: string } | any = localStorage.getItem('info');

    if(infoTD){
      const newInfoTD = Object.assign({},JSON.parse(infoTD),{"joins": joins})
      localStorage.setItem('info', JSON.stringify(newInfoTD));
    }
  },[joins]);

  return (
    <Box>
      <Value>Feature group joins</Value>

      {joins.length > 1 && <JoinsMessage joins={joins} />}

      <InnerJoinForm
        items={joins}
        options={options}
        isDisabled={isDisabled}
        handleChange={handleChange}
      />
    </Box>
  );
};

export default FeatureGroupJoinForm;
