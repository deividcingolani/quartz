import React, { ComponentType, FC } from 'react';
import {
  Callout,
  CalloutTypes,
  Drawer,
  Row,
  Value,
} from '@logicalclocks/quartz';
import { Box } from 'rebass';

// Types
import { SchematisedTagEntity } from '../../../../types/feature-group';
// Hooks
import usePropertiesListRows from './usePropertiesListRows';

export interface SchematisedTagDrawerProps {
  data: SchematisedTagEntity;
  isOpen: boolean;
  handleToggle: () => void;
}

const styles = {
  border: 'none !important',
  pb: 0,
  mb: '-15px',

  tbody: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'grayShade2',
  },
};

const SchematisedTagDrawer: FC<SchematisedTagDrawerProps> = ({
  data,
  handleToggle,
  isOpen,
}) => {
  const [tagsComponents, tagsProps] = usePropertiesListRows(data);

  return (
    <Drawer
      sx={styles}
      mt="10px"
      singleBottom={false}
      bottom="20px"
      closeOnBackdropClick={true}
      isOpen={isOpen}
      onClose={handleToggle}
      headerSummary={
        <Box width="100%">
          <Value fontSize="18px" mb="15px">
            {data.name}
          </Value>
          <Row
            middleColumn={0}
            groupComponents={tagsComponents as ComponentType<any>[][]}
            groupProps={tagsProps}
          />
        </Box>
      }
    >
      <Drawer.Section title="">
        <Callout
          type={CalloutTypes.neutral}
          content="Tag schemas are immutable."
        />
      </Drawer.Section>
    </Drawer>
  );
};

export default SchematisedTagDrawer;
