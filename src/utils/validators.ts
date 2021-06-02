import * as yup from 'yup';

export const numInt = yup.number().integer();
export const alphanum = yup.string().required().max(50);
export const shortText = yup.string().max(200);
export const shortRequiredText = yup.string().required().max(200);
export const longText = yup.string().max(500);
export const filePath = yup.string().required();

export const name = yup
  .string()
  .required()
  .max(50)
  .matches(/^[a-zA-Z0-9-_]*$/, {
    message: 'Only alphanumeric characters, dash or underscore',
    excludeEmptyString: false,
  });

export const nameNotRequired = yup
  .string()
  .max(50)
  .matches(/^[a-zA-Z0-9-_]*$/, {
    message: 'Only alphanumeric characters, dash or underscore',
    excludeEmptyString: false,
  });

export const password = yup
  .string()
  .min(6)
  .test(
    'password',
    'Password must contains at least 1 digit, 1 uppercase and 1 lowercase',
    (value) => {
      if (!value) {
        return false;
      }
      const patters = [/[a-z]/, /[A-Z]/, /[0-9]/];
      return patters.every((p) => p.test(value));
    },
  );

export const float = yup.string().matches(/^\d*\.{1}\d*$/, {
  message: 'Only float number',
  excludeEmptyString: false,
});

export const integer = yup.string().matches(/[0-9]/, {
  message: 'Only integer number',
  excludeEmptyString: false,
});

export const string = yup.string().max(50);

export const floatRequired = yup.string().required().matches(/[0-9]/, {
  message: 'Only float number',
  excludeEmptyString: false,
});

export const executorMemory = yup
  .string()
  .notRequired()
  .matches(/[0-9]/, {
    message: 'Executor memory should not be less than 1024',
    excludeEmptyString: true,
  })
  .test(
    'executorMemory',
    'Executor memory should not be less than 1024',
    (value: any) => value >= 1024,
  );

export const integerRequired = yup.string().required().matches(/[0-9]/, {
  message: 'Only integer number',
  excludeEmptyString: false,
});

export const stringRequired = yup.string().required().max(50);

export const anyType = yup.mixed();
