// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popup, UploadButton } from '@logicalclocks/quartz';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Flex } from 'rebass';
import FileExplorer from '../file-explorer/fileExplorer';
import { FileExplorerMode } from '../file-explorer/types';
import TokenService from '../../services/TokenService';

const FileUploader = ({
  isMultiple,
  fromFile,
  options,
  helperForNewArr,
  isDisabledUploadButton,
  setIsOpenExplorerFromPopup,
}: any) => {
  const { id: projectId } = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const token = TokenService.get();
  const makeid = (length: number) => {
    const result = [];
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength)),
      );
    }
    return result.join('');
  };

  const flowChunkSize = 1048576;
  const [uploadPath, setUploadPath] = useState<string>();
  const [isOpenExplorer, setIsOpenExplorer] = useState(false);
  const [fileToBeUpload, setFileToBeUpload] = useState<any>({});
  const [arrayToUpload, setArrayToUpload] = useState<any>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [counter, setCounter] = useState(1);
  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(flowChunkSize);
  // eslint-disable-next-line
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line
  const [fileGuid, setFileGuid] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);
  const [flowCurrentChunkSize, setFlowCurrentChunkSize] = useState(0);
  const [firstRef, setFirstRef] = useState<any>(null);
  const [fileCounter, setFileCounter] = useState<any>(0);

  const uploadFile = (file: any) => {
    setFileSize(file.size);
    const totalCount =
      file.size % flowChunkSize === 0
        ? file.size / flowChunkSize
        : Math.floor(file.size / flowChunkSize) + 1; // Total count of chunks will have been upload to finish the file
    setChunkCount(totalCount);
    setFileToBeUpload(file);
    const fileName = file.name;
    setFileGuid(fileName);
    if (flowChunkSize <= file.size) {
      setFlowCurrentChunkSize(flowChunkSize);
    } else {
      setFlowCurrentChunkSize(file.size);
    }
    setShowProgress(true);
  };

  useEffect(() => {
    if (fileCounter > 0) {
      uploadFile(arrayToUpload[fileCounter - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileCounter]);

  const clearUploadData = () => {
    setChunkCount(0);
    setShowProgress(false);
    setFileSize(0);
    setProgress(0);
    setFileGuid('');
    setCounter(1);
    setBeginingOfTheChunk(0);
    setEndOfTheChunk(flowChunkSize);
  };

  const getFileContext = () => {
    const uploadArray: any = [];

    Object.keys(firstRef.current.files).map((key) => {
      const file = firstRef.current.files[key];
      return uploadArray.push(file);
    });
    setArrayToUpload(uploadArray);
    setFileCounter(uploadArray.length);
  };

  const handleSetIsOpenExplorerFromPopup = (value: boolean) => {
    if (setIsOpenExplorerFromPopup) {
      setIsOpenExplorerFromPopup(value);
    }
  };

  const handleClick = useCallback(() => {
    setIsOpenExplorer(true);
    handleSetIsOpenExplorerFromPopup(true);
    if (firstRef && firstRef.current) {
      firstRef.current.value = '';
    }

    setFirstRef(fileRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRef]);

  const handleSelectFileFrom = useCallback(() => {
    if (!firstRef) {
      return;
    }

    if (firstRef && firstRef.current) {
      firstRef.current.click();
    }
  }, [firstRef]);

  const helper = () => {
    helperForNewArr(
      {
        name: fileToBeUpload.name,
        path: `${uploadPath}/${fileToBeUpload.name}`,
        id: `${uploadPath}/${fileToBeUpload.name}`,
      },
      options,
    );
    if (options !== 'isJobFile' && !!options) {
      clearUploadData();
    }
  };

  const uploadChunk = async (chunk: any) => {
    if (endOfTheChunk + flowChunkSize <= fileSize) {
      setFlowCurrentChunkSize(flowChunkSize);
      setEndOfTheChunk(endOfTheChunk + flowChunkSize);
    } else {
      setFlowCurrentChunkSize(fileSize - endOfTheChunk);
      setEndOfTheChunk(fileSize);
    }
    setBeginingOfTheChunk(endOfTheChunk);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('flowChunkNumber', counter.toString());
    formData.append('flowChunkSize', flowChunkSize.toString());
    formData.append('flowCurrentChunkSize', flowCurrentChunkSize.toString());
    formData.append('flowFilename', `${fileToBeUpload.name}`);
    formData.append('flowRelativePath', `${fileToBeUpload.name}`);
    formData.append('flowTotalChunks', chunkCount.toString());
    formData.append('flowIdentifier', `${makeid(10)} ${fileToBeUpload.name}`);
    formData.append('flowTotalSize', fileSize.toString());
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/project/${projectId}/dataset/upload${uploadPath}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
          data: formData,
        },
      );

      if (response.status === 200) {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + flowChunkSize);
        if (counter === chunkCount) {
          setProgress(100);
          setFileCounter(fileCounter - 1);
          setShowProgress(false);
          helper();
        } else {
          const percentage = (counter / chunkCount) * 100;
          setProgress(percentage);
          setCounter(counter + 1);
        }
      } else {
        console.log('Error Occurred:');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (showProgress && counter <= chunkCount) {
      const chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
      uploadChunk(chunk);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, showProgress]);

  return (
    <>
      <Flex flexDirection="column">
        <UploadButton
          isDisabledUploadButton={isDisabledUploadButton}
          modeNFiles={isMultiple}
          currentRef={firstRef}
          intent="secondary"
          onHandleUpload={getFileContext}
          handleClick={() => {
            handleClick();
          }}
          maxWidth="145px"
        >
          {`Upload ${fromFile ? 'new' : 'job'} file`}
        </UploadButton>
      </Flex>

      <Popup
        left="40px"
        right="40px"
        top="20px"
        bottom="20px"
        isOpen={isOpenExplorer}
        onClose={() => {
          setIsOpenExplorer(false);
          handleSetIsOpenExplorerFromPopup(false);
        }}
      >
        <FileExplorer
          title="Select folder"
          mode={FileExplorerMode.oneFolder}
          handleCloseExplorer={() => {
            setIsOpenExplorer(false);
            handleSetIsOpenExplorerFromPopup(false);
          }}
          handleSelectFile={(activeFile: any, _: boolean) => {
            // activeFile in case of folder is the string
            // containing the path to the folder
            setUploadPath(activeFile);
            // Open the selector for the local file to upload
            handleSelectFileFrom();
            setIsOpenExplorer(false);
            handleSetIsOpenExplorerFromPopup(false);
          }}
        />
      </Popup>
    </>
  );
};

export default FileUploader;
