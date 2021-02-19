import { Box, Flex } from 'rebass';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Select,
  Button,
  Badge,
  TinyPopup,
  Input,
  usePopup,
} from '@logicalclocks/quartz';
import CardLabels from '../../pages/project/feature-group/list/CardLabels';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '../../store';
import * as yup from 'yup';
import { name } from '../../utils/validators';
import getInputValidation from '../../utils/getInputValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface KeywordsEditorProps {
  value: string[];
  onSave: (keywords: string[]) => void;
  isDisabled?: boolean;
  shouldClear?: boolean;
  selectVariant?: 'primary' | 'white';
}

export const keywordSchema = yup.object().shape({
  keyword: name.label('Keyword name'),
});

const KeywordsEditor: FC<KeywordsEditorProps> = ({
  value,
  onSave,
  isDisabled = false,
  selectVariant = 'white',
  shouldClear = true,
}) => {
  const { id: projectId } = useParams();

  const { errors, register, handleSubmit, clearErrors, setError } = useForm({
    shouldUnregister: false,
    resolver: yupResolver(keywordSchema),
  });

  const baseOptions = useSelector(
    (state: RootState) => state.featureGroupLabels,
  );

  const dispatch = useDispatch<Dispatch>();

  const [isPopupOpen, handleToggle] = usePopup(false);

  const [options, setOptions] = useState<string[]>(baseOptions);
  const [values, setValues] = useState<string[]>(value);

  const keywordsHandler = useCallback((values) => {
    setValues(values);
  }, []);

  const [isEdit, setEdit] = useState(false);

  const saveHandler = useCallback(async () => {
    await onSave(values);
    setEdit(true);
    if (shouldClear) {
      dispatch.featureGroups.clear();
    }
    setEdit(false);
  }, [values, onSave, dispatch, shouldClear]);

  const cancelHandler = useCallback(() => {
    setValues(value);
    setOptions(baseOptions);
    setEdit(false);
  }, [value, baseOptions]);

  const handleAdd = useCallback(
    async (keyword: string) => {
      setOptions((prev) => [keyword, ...prev]);
      setValues((prev) => [keyword, ...prev]);
      handleToggle();
    },
    [handleToggle],
  );

  useEffect(() => {
    setValues(value);
    dispatch.featureGroupLabels.fetch({
      projectId: +projectId,
    });
    setEdit(false);
  }, [value, dispatch, projectId]);

  useEffect(() => {
    setOptions(baseOptions);
  }, [baseOptions]);

  useEffect(() => {
    clearErrors();
  }, [handleToggle, clearErrors]);

  const isLoading = useSelector(
    (state: RootState) => state.loading.effects.featureGroupLabels.attachLabels,
  );

  const onSubmit = useCallback(
    handleSubmit(({ keyword }) => {
      if (baseOptions.includes(keyword)) {
        setError('keyword', { message: 'Keyword should be unique' });
        return;
      }
      handleAdd(keyword);
    }),
    [handleAdd, baseOptions],
  );

  if (isEdit) {
    return (
      <>
        <Flex>
          <Select
            listWidth="100%"
            isMulti
            flex={1}
            variant={selectVariant}
            onChange={keywordsHandler}
            value={values}
            options={options}
            placeholder="keywords"
            bottomActionHandler={() => handleToggle()}
            bottomActionText="Add another keyword"
            noDataMessage="No keywords defined"
          />
          <Flex ml="10px">
            <Button
              disabled={isLoading}
              mr="10px"
              onClick={cancelHandler}
              intent="secondary"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={saveHandler}>
              Save
            </Button>
          </Flex>
        </Flex>
        <TinyPopup
          title="Add another keyword"
          secondaryText=""
          isOpen={isPopupOpen}
          mainButton={['Create new keyword', onSubmit]}
          secondaryButton={['Cancel', handleToggle]}
          onClose={handleToggle}
        >
          <Box mt="-20px" mb="20px">
            <Input
              ref={register}
              labelProps={{ width: '100%' }}
              label="Value"
              name="keyword"
              placeholder="New keyword value"
              {...getInputValidation('keyword', errors)}
            />
          </Box>
        </TinyPopup>
      </>
    );
  }

  return (
    <Flex>
      {value?.length ? (
        <CardLabels labels={values} />
      ) : (
        <Badge variant="bold" value="No keywords" />
      )}

      <Button
        height="20px"
        mt="-7px"
        intent="inline"
        disabled={isDisabled}
        onClick={() => setEdit(true)}
      >
        edit keywords
      </Button>
    </Flex>
  );
};

export default KeywordsEditor;
