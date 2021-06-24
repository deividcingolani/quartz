// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React from 'react';
import { Value } from '@logicalclocks/quartz';

const renderValidationType = (type: string | undefined) => {
  const validationType = {
    none: 'none',
    all: 'all',
    warning: 'warning',
    strict: 'strict',
  };
  switch (type) {
    case 'NONE': {
      return (
        <span>
          – configured in{' '}
          {
            <Value primary display="inline-block">
              {validationType.none}
            </Value>
          }{' '}
          mode (no data validation is performed)
        </span>
      );
    }
    case 'ALL': {
      return (
        <span>
          – configured in{' '}
          {
            <Value primary display="inline-block">
              {validationType.all}
            </Value>
          }{' '}
          mode (data is ingested no matter the status of the data validation)
        </span>
      );
    }
    case 'WARNING': {
      return (
        <span>
          – configured in{' '}
          {
            <Value primary display="inline-block">
              {validationType.warning}
            </Value>
          }{' '}
          mode (data is ingested on data validation success and warning)
        </span>
      );
    }
    case 'STRICT': {
      return (
        <span>
          – configured in{' '}
          {
            <Value primary display="inline-block">
              {validationType.strict}
            </Value>
          }{' '}
          mode (data is ingested only on data validation success)
        </span>
      );
    }
    default: {
      return (
        <span>
          – configured in{' '}
          {
            <Value primary display="inline-block">
              {validationType.none}
            </Value>
          }{' '}
          mode (no data validation is performed)
        </span>
      );
    }
  }
};

export default renderValidationType;
