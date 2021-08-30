// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
// Components
import NewLibraryFile from './NewLibraryFile';

interface WheelFormProps {
  setInstallCount: (arg: number) => void;
  installCount: number;
  setIsOpenExplorerFromPopup: (arg: boolean) => void;
  setIsRequesting: (arg: boolean) => void;
  isRequesting: boolean;
  postInstallationCheck: (arg: number) => void;
}
const WheelForm: FC<WheelFormProps> = ({
  setIsOpenExplorerFromPopup,
  setIsRequesting,
  isRequesting,
  postInstallationCheck,
}) => {
  return (
    <NewLibraryFile
      label="Pick a .whl or .egg file"
      channelUrl=""
      packageSource=""
      setIsRequesting={setIsRequesting}
      setIsOpenExplorerFromPopup={setIsOpenExplorerFromPopup}
      fileNamePattern={RegExp(`.*.egg$|.*.whl$`)}
      isRequesting={isRequesting}
      postInstallationCheck={postInstallationCheck}
      setChannelAndPackage={(fileName) => {
        const arr = fileName.split('.');
        const fileExt = arr.pop();
        if (fileExt === 'whl') return ['wheel', 'WHEEL'];
        if (fileExt === 'egg') {
          return ['egg', 'EGG'];
        }
        throw new Error('Invalid file name');
      }}
    />
  );
};

export default memo(WheelForm);
