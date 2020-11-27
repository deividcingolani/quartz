import * as yup from 'yup';

export const alphanum = yup.string().required().max(50);
export const name = yup
  .string()
  .required()
  .max(50)
  .matches(/^[a-zA-Z0-9-_]*$/, {
    message: 'Only alphanumeric characters, dash or underscore',
    excludeEmptyString: false,
  });
export const shortText = yup.string().max(200);
export const longText = yup.string().max(500);
