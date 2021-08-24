// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import { Box, Flex, FlexProps } from 'rebass';
import { Controller } from 'react-hook-form';
import {
  Button,
  Checkbox,
  FileLoader,
  Input,
  RadioGroup,
  Value,
} from '@logicalclocks/quartz';
import { DynamicAllocation, FrameworkTypeUI, FormType } from '../types';
// Utils
import getInputValidation from '../../../../utils/getInputValidation';
import icons from '../../../../sources/icons';
import {
  FileExplorerMode,
  FileExplorerOptions,
  UploadFiles,
} from '../../../../components/file-explorer/types';
import { FrameworkType } from '../../../../types/jobs';
import { setFrameworkType, setFrameworkUIType } from '../utils/setTypeOfJobs';
import FileUploader from '../../../../components/file-uploader/fileUploader';

export interface AdvancedConfigProps extends Omit<FlexProps, 'css'> {
  canSave: boolean;
  formType: FormType;
  isLoading: boolean;
  isEdit: boolean;
  activeJobFile: UploadFiles | null;
  register: any;
  errors: any;
  watch: any;
  control: any;
  type: FrameworkType;
  onDelete: any;
  setType: Dispatch<SetStateAction<FrameworkType>>;
  setIsOpenExplorer: Dispatch<SetStateAction<boolean>>;
  setFileExplorerOptions: Dispatch<SetStateAction<FileExplorerOptions>>;
  setFileExplorerMode: Dispatch<SetStateAction<FileExplorerMode>>;
  helperForNewArr: (newFile: any, options: string) => void;
  additionalArchives: UploadFiles[] | null;
  setAdditionalArchives: Dispatch<SetStateAction<UploadFiles[] | null>>;
  additionalJars: UploadFiles[] | null;
  setAdditionalJars: Dispatch<SetStateAction<UploadFiles[] | null>>;
  additionalPython: UploadFiles[] | null;
  setAdditionalPython: Dispatch<SetStateAction<UploadFiles[] | null>>;
  additionalFiles: UploadFiles[] | null;
  setAdditionalFiles: Dispatch<SetStateAction<UploadFiles[] | null>>;
}

const AdvancedConfig: FC<AdvancedConfigProps> = ({
  formType,
  isLoading,
  isEdit,
  activeJobFile,
  onDelete,
  canSave,
  // useForm
  register,
  watch,
  errors,
  control,
  // Parent's state
  type,
  setType,
  setIsOpenExplorer,
  setFileExplorerOptions,
  setFileExplorerMode,
  additionalArchives,
  setAdditionalArchives,
  additionalJars,
  setAdditionalJars,
  additionalPython,
  setAdditionalPython,
  additionalFiles,
  setAdditionalFiles,
  // Utils
  helperForNewArr,
  ...props
}) => {
  const [advancedConfiguration, setAdvancedConfiguration] = useState(
    formType === FormType.JUPYTER,
  );

  const dynamicAllocation = watch('spark.dynamicAllocation.enabled', true);

  const handleSetAdvConfigurations = () => {
    setAdvancedConfiguration(!advancedConfiguration);
  };

  return (
    <Flex flexDirection="column" {...props}>
      <Controller
        control={control}
        name="type"
        defaultValue={FrameworkType.SPARK}
        render={({ onChange, value }) => (
          <RadioGroup
            disabled={!canSave}
            flexDirection="row"
            mr="30px"
            value={setFrameworkUIType(value)}
            options={[FrameworkTypeUI.SPARK, FrameworkTypeUI.PYTHON]}
            onChange={(value) => {
              setType(setFrameworkType(value));
              return onChange(setFrameworkType(value));
            }}
          />
        )}
      />
      {type === FrameworkType.SPARK && activeJobFile?.extension === 'jar' && (
        <Box mt="20px">
          <Input
            name="mainClass"
            ref={register}
            placeholder="com.logicalclocks.example.FeatureStoreExample"
            label="Main class"
            labelProps={{ width: '100%' }}
            disabled={isLoading}
          />
        </Box>
      )}
      <Box my="20px">
        <Checkbox
          checked={advancedConfiguration}
          label="Advanced configuration"
          disabled={!canSave}
          onChange={handleSetAdvConfigurations}
        />
      </Box>
      {advancedConfiguration && type === FrameworkType.SPARK && (
        <Flex flexDirection="column">
          <Flex
            sx={{
              mb: '20px',
            }}
          >
            <Input
              name="amMemory"
              ref={register({
                setValueAs: (value: string) =>
                  value ? parseInt(value, 10) : 2048,
              })}
              placeholder=""
              label="Driver  memory (MB)"
              labelProps={{ width: '190px', mr: '20px' }}
              disabled={isLoading || !canSave}
            />
            <Input
              name="amVCores"
              ref={register({
                setValueAs: (value: string) =>
                  value ? parseInt(value, 10) : 1,
              })}
              placeholder=""
              label="Driver virtual cores"
              labelProps={{ width: '190px' }}
              disabled={isLoading || !canSave}
            />
          </Flex>
          <Flex
            sx={{
              mb: '20px',
            }}
          >
            <Input
              name="spark.executor.memory"
              ref={register({
                required: false,
                setValueAs: (value: string) =>
                  value ? parseInt(value, 10) : 2048,
              })}
              placeholder=""
              label="Executor  memory (MB)"
              labelProps={{ width: '190px', mr: '20px' }}
              disabled={isLoading || !canSave}
              {...getInputValidation('spark.executor.memory', errors)}
            />
            <Input
              name="spark.executor.cores"
              ref={register({
                setValueAs: (value: string) =>
                  value ? parseInt(value, 10) : 1,
              })}
              placeholder=""
              label="Executor virtual cores"
              labelProps={{ width: '190px' }}
              disabled={isLoading || !canSave}
            />
          </Flex>
          <Flex>
            <Controller
              control={control}
              name="spark.dynamicAllocation.enabled"
              defaultValue={DynamicAllocation.DYNAMIC}
              render={({ onChange, value }) => (
                <RadioGroup
                  disabled={isLoading || !canSave}
                  flexDirection="row"
                  mr="30px"
                  value={
                    value ? DynamicAllocation.DYNAMIC : DynamicAllocation.STATIC
                  }
                  options={[
                    DynamicAllocation.DYNAMIC,
                    DynamicAllocation.STATIC,
                  ]}
                  onChange={(value) =>
                    onChange(value === DynamicAllocation.DYNAMIC)
                  }
                />
              )}
            />
          </Flex>
          {dynamicAllocation ? (
            <Flex
              sx={{
                my: '20px',
              }}
            >
              <Input
                name="spark.dynamicAllocation.minExecutors"
                ref={register({
                  setValueAs: (value: string) =>
                    value ? parseInt(value, 10) : 1,
                })}
                placeholder=""
                label="Min executors"
                labelProps={{ width: '190px', mr: '20px' }}
                disabled={isLoading || !canSave}
              />
              <Input
                name="spark.dynamicAllocation.maxExecutors"
                ref={register({
                  setValueAs: (value: string) =>
                    value ? parseInt(value, 10) : 1,
                })}
                placeholder=""
                label="Max executors"
                labelProps={{ width: '190px' }}
                disabled={isLoading || !canSave}
              />
            </Flex>
          ) : (
            <Input
              name="spark.executor.instances"
              ref={register({
                setValueAs: (value: string) =>
                  value ? parseInt(value, 10) : 1,
              })}
              placeholder=""
              label="Number of executors"
              labelProps={{ width: '190px', my: '20px' }}
              disabled={isLoading || !canSave}
            />
          )}
        </Flex>
      )}
      {advancedConfiguration && type === FrameworkType.SPARK && (
        <>
          <Flex flexDirection="column">
            <Value>Additional archives</Value>
            <Flex mt="8px">
              <Button
                intent="secondary"
                mr="8px"
                disabled={isLoading || !canSave}
                onClick={() => {
                  setFileExplorerOptions(FileExplorerOptions.archives);
                  setFileExplorerMode(FileExplorerMode.nFiles);
                  setIsOpenExplorer(true);
                }}
              >
                <Box
                  sx={{
                    height: '16px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    svg: {
                      mr: '9px',
                      path: {
                        fill: 'primary',
                      },
                    },
                  }}
                >
                  {icons.folder}
                </Box>
                From project
              </Button>
              <FileUploader
                key={3}
                fromFile
                options="isArchives"
                isDisabledUploadButton={isLoading || !canSave}
                helperForNewArr={helperForNewArr}
              />
            </Flex>
            {additionalArchives &&
              additionalArchives.map((el: UploadFiles) => {
                return (
                  <Box mt="20px" key={el.id}>
                    <FileLoader
                      disabled={isLoading || !canSave}
                      removeHandler={(id: any) => {
                        const newArr = additionalArchives.filter(
                          (item: any) => id !== item.id,
                        );
                        setAdditionalArchives(newArr);
                      }}
                      isLoading={!additionalArchives}
                      fileName={el.name}
                      id={el.id}
                      located={el.path
                        .split('/')
                        .slice(0, el.path.split('/').length - 1)
                        .join('/')}
                    >
                      located in
                    </FileLoader>
                  </Box>
                );
              })}
          </Flex>
          <Flex flexDirection="column" mt="20px">
            <Value>No additional jars</Value>
            <Flex mt="8px">
              <Button
                disabled={isLoading || !canSave}
                intent="secondary"
                mr="8px"
                onClick={() => {
                  setFileExplorerOptions(FileExplorerOptions.jars);
                  setFileExplorerMode(FileExplorerMode.nFiles);
                  setIsOpenExplorer(true);
                }}
              >
                <Box
                  sx={{
                    height: '16px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    svg: {
                      mr: '9px',
                      path: {
                        fill: 'primary',
                      },
                    },
                  }}
                >
                  {icons.folder}
                </Box>
                From project
              </Button>
              <FileUploader
                key={4}
                fromFile
                options="isJars"
                isDisabledUploadButton={isLoading || !canSave}
                helperForNewArr={helperForNewArr}
              />
            </Flex>
            {additionalJars &&
              additionalJars.map((el: UploadFiles) => {
                return (
                  <Box mt="20px" key={el.id}>
                    <FileLoader
                      disabled={isLoading || !canSave}
                      removeHandler={(id: any) => {
                        const newArr = additionalJars.filter(
                          (item: UploadFiles) => id !== item.id,
                        );
                        setAdditionalJars(newArr);
                      }}
                      isLoading={!el}
                      fileName={el.name}
                      id={el.id}
                      located={el.path
                        .split('/')
                        .slice(0, el.path.split('/').length - 1)
                        .join('/')}
                    >
                      located in
                    </FileLoader>
                  </Box>
                );
              })}
          </Flex>
          <Flex flexDirection="column" mt="20px">
            <Value>No additional python dependencies</Value>
            <Flex mt="8px">
              <Button
                disabled={isLoading || !canSave}
                intent="secondary"
                mr="8px"
                onClick={() => {
                  setFileExplorerOptions(FileExplorerOptions.python);
                  setFileExplorerMode(FileExplorerMode.nFiles);
                  setIsOpenExplorer(true);
                }}
              >
                <Box
                  sx={{
                    height: '16px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    svg: {
                      mr: '9px',
                      path: {
                        fill: 'primary',
                      },
                    },
                  }}
                >
                  {icons.folder}
                </Box>
                From project
              </Button>
              <FileUploader
                isDisabledUploadButton={isLoading || !canSave}
                key={5}
                fromFile
                options="isPython"
                helperForNewArr={helperForNewArr}
              />
            </Flex>
            {additionalPython &&
              additionalPython.map((el: UploadFiles) => {
                return (
                  <Box mt="20px" key={el.id}>
                    <FileLoader
                      disabled={isLoading || !canSave}
                      removeHandler={(id: any) => {
                        const newArr = additionalPython.filter(
                          (item: UploadFiles) => id !== item.id,
                        );
                        setAdditionalPython(newArr);
                      }}
                      isLoading={!additionalPython}
                      fileName={el.name}
                      id={el.id}
                      located={el.path
                        .split('/')
                        .slice(0, el.path.split('/').length - 1)
                        .join('/')}
                    >
                      located in
                    </FileLoader>
                  </Box>
                );
              })}
          </Flex>
          <Flex flexDirection="column" my="20px">
            <Value>No additional files</Value>
            <Flex mt="8px">
              <Button
                disabled={isLoading || !canSave}
                intent="secondary"
                mr="8px"
                onClick={() => {
                  setFileExplorerOptions(FileExplorerOptions.files);
                  setFileExplorerMode(FileExplorerMode.nFiles);
                  setIsOpenExplorer(true);
                }}
              >
                <Box
                  sx={{
                    height: '16px',
                    overflow: 'hidden',
                    display: 'inline-block',
                    svg: {
                      mr: '9px',
                      path: {
                        fill: 'primary',
                      },
                    },
                  }}
                >
                  {icons.folder}
                </Box>
                From project
              </Button>
              <FileUploader
                isDisabledUploadButton={isLoading || !canSave}
                key={6}
                fromFile
                options="isFile"
                helperForNewArr={helperForNewArr}
              />
            </Flex>
            {!!additionalFiles &&
              additionalFiles.map((el: UploadFiles) => {
                return (
                  <Box mt="20px" key={el.id}>
                    <FileLoader
                      disabled={isLoading || !canSave}
                      removeHandler={(id: any) => {
                        const newArr = additionalFiles.filter(
                          (item: UploadFiles) => id !== item.id,
                        );
                        setAdditionalFiles(newArr);
                      }}
                      isLoading={!additionalFiles}
                      fileName={el.name}
                      id={el.id}
                      located={el.path
                        .split('/')
                        .slice(0, el.path.split('/').length - 1)
                        .join('/')}
                    >
                      located in
                    </FileLoader>
                  </Box>
                );
              })}
          </Flex>
          <Box mt="20px">
            <Controller
              control={control}
              name="properties"
              defaultValue=""
              render={({ onChange, value }) => (
                <Input
                  name="properties"
                  type="textarea"
                  placeholder="enter properties and values"
                  label="Properties"
                  sx={{
                    width: '100%',
                    borderWidth: 0,
                    p: '8px',
                    fontFamily: 'Inter',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '12px',
                  }}
                  labelProps={{ width: '100%' }}
                  disabled={isLoading || !canSave}
                  value={value}
                  onChange={(value: any) => onChange(value)}
                />
              )}
            />
          </Box>
        </>
      )}

      {advancedConfiguration && type === FrameworkType.PYTHON && (
        <>
          <Flex flexDirection="column">
            <Flex>
              <Input
                name="resourceConfig.memory"
                ref={register({
                  setValueAs: (value: string) =>
                    value ? parseInt(value, 10) : 2048,
                })}
                placeholder=""
                label="Container memory"
                labelProps={{ width: '190px', mr: '20px' }}
                disabled={isLoading || !canSave}
              />
              <Input
                name="resourceConfig.cores"
                ref={register({
                  setValueAs: (value: string) =>
                    value ? parseInt(value, 10) : 1,
                })}
                placeholder=""
                label="Container cores"
                labelProps={{ width: '190px' }}
                disabled={isLoading || !canSave}
              />
            </Flex>
            <Flex flexDirection="column" my="20px">
              <Value>No additional files</Value>
              <Flex mt="8px">
                <Button
                  disabled={isLoading || !canSave}
                  intent="secondary"
                  mr="8px"
                  onClick={() => {
                    setFileExplorerOptions(FileExplorerOptions.files);
                    setFileExplorerMode(FileExplorerMode.nFiles);
                    setIsOpenExplorer(true);
                  }}
                >
                  <Box
                    sx={{
                      height: '16px',
                      overflow: 'hidden',
                      display: 'inline-block',
                      svg: {
                        mr: '9px',
                        path: {
                          fill: 'primary',
                        },
                      },
                    }}
                  >
                    {icons.folder}
                  </Box>
                  From project
                </Button>
                <FileUploader
                  isDisabledUploadButton={isLoading || !canSave}
                  key={6}
                  fromFile
                  options="isFile"
                  helperForNewArr={helperForNewArr}
                />
              </Flex>
              {additionalFiles &&
                additionalFiles.map((el: UploadFiles) => {
                  return (
                    <Box mt="20px" key={el.id}>
                      <FileLoader
                        disabled={isLoading || !canSave}
                        removeHandler={(id: any) => {
                          const newArr = additionalFiles.filter(
                            (item: UploadFiles) => id !== item.id,
                          );
                          setAdditionalFiles(newArr);
                        }}
                        isLoading={!additionalFiles}
                        fileName={el.name}
                        id={el.id}
                        located={el.path
                          .split('/')
                          .slice(0, el.path.split('/').length - 1)
                          .join('/')}
                      >
                        located in
                      </FileLoader>
                    </Box>
                  );
                })}
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default AdvancedConfig;
