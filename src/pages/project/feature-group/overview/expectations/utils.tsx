import { Value } from '@logicalclocks/quartz';
import React from 'react';

export const renderValidationType = (type: string) => {
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
  }
};
