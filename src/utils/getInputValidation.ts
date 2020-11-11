// eslint-disable-next-line import/no-unresolved
import { FieldErrors } from 'react-hook-form/dist/types/errors';

export interface GetInputValidation {
  info?: string;
  intent: 'default' | 'error';
}

const getInputValidation = (
  name: string,
  errors: FieldErrors<any> = {},
): GetInputValidation => ({
  info: errors[name]?.message,
  intent: errors[name]?.message ? 'error' : 'default',
});

export default getInputValidation;
