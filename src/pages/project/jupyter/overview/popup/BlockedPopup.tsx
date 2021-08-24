// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';
import { Button, Labeling, TinyPopup } from '@logicalclocks/quartz';
import { Box, Flex } from 'rebass';
import popUpIcon from './popup-icon.png';

export interface BlockedPopup {
  isPopupOpen: boolean;
  handleToggle: () => void;
}

const BlockedPopup: FC<BlockedPopup> = ({ isPopupOpen, handleToggle }) => {
  return (
    <TinyPopup
      title=""
      secondaryText=""
      isOpen={isPopupOpen}
      onClose={handleToggle}
      bg="grayShade3"
    >
      <Flex
        width="calc(100% + 40px)"
        bg="white"
        mx="-20px"
        mt="-40px"
        pl="10px"
        mb="20px"
      >
        <Flex width="400px" flexDirection="column" p="20px">
          <Labeling mb="20px">
            To automatically open Jupyter once the server is ready, you have to
            allow popups of you web browser.
          </Labeling>
          <Box mb="20px">
            <svg
              width="360"
              height="54"
              viewBox="0 0 360 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="360" height="53.4193" fill="url(#pattern0)" />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0"
                    transform="translate(0 -0.00724643) scale(0.000672043 0.00452899)"
                  />
                </pattern>
                <image
                  id="image0"
                  width="1488"
                  height="224"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </Box>
          <Flex flexDirection="row" mb="20px">
            <Labeling mb="20px" mr="8px">
              In the address bar, click on Pop-up blocked.
            </Labeling>
            <Box width="20px" height="18px">
              <img width="100%" src={popUpIcon} alt="Pop up blocked icon" />
            </Box>
          </Flex>
          <Labeling>
            Then select <b>Always allow pop-ups and redirects from Hopsworks</b>{' '}
            and then <b>Done</b>.
          </Labeling>
        </Flex>
      </Flex>
      <Flex justifyContent="flex-end">
        <Button intent="secondary" onClick={handleToggle}>
          Got it
        </Button>
      </Flex>
    </TinyPopup>
  );
};

export default BlockedPopup;
