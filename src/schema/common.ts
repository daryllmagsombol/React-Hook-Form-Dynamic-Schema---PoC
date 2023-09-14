import * as yup from 'yup';

export const tests = {
  len: {
    fnName: 'len',
    message: 'Employee ID must be exactly 7 characters',
    fn: (val) => val && val.toString().length === 7,
  },
  unique: {
    name: 'unique',
    message: 'Employee ID must be unique',
    fn: async function (value) {
      // Validates thru API call
      if (!value) return true; // Skip the test if the field is empty
      const { checkEmployeeIdUniqueness } = this.options.context;
      return checkEmployeeIdUniqueness(value); // Call the validation function and return the result
    },
  },
};

export const personalInfoFields = [
  {
    name: 'firstName',
    label: 'First Name',
    validationType: 'string',
    validations: [
      {
        type: 'required',
        // params: 'Required',
      },
    ],
  },
  {
    name: 'middleName',
    label: 'MIddle Name',
    validationType: 'string',
  },
  {
    name: 'lastName',
    label: 'Last name',
    validationType: 'string',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
    ],
  },
  {
    name: 'birthday',
    label: 'Birthday',
    validationType: 'date',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
    ],
  },
  {
    name: 'gender',
    label: 'Gender',
    validationType: 'string',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
    ],
  },
  {
    name: 'address',
    label: 'Address',
    validationType: 'string',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
    ],
  },
  {
    name: 'address',
    label: 'Address',
    validationType: 'number',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
    ],
  },
  {
    name: 'employeeId',
    label: 'Employee ID',
    validationType: 'string',
    validationTypeError: 'Employee ID must be a string',
    validations: [
      {
        type: 'required',
        params: 'Required',
      },
      {
        type: 'test',
        params: { fnName: 'len' },
      },
      {
        type: 'test',
        params: { fnName: 'unique' },
      },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    validationType: 'string',
    validations: [
      {
        type: 'oneOf',
        params: ['submitted', 'draft'],
      },
    ],
  },
];

const getValidationSchema = (fields) => {
  const schema = fields.reduce((schema, field) => {
    const {
      label,
      name,
      validationType,
      validationTypeError,
      validations = [],
    } = field;
    const isObject = name.indexOf('.') >= 0;

    if (!yup[validationType]) {
      return schema;
    }
    let validator = yup[validationType]().typeError(validationTypeError || '');
    if (label) validator = validator.label(label);

    validations.forEach((validation) => {
      const { params = '', type } = validation;
      if (!validator[type]) {
        return;
      }
      if (type === 'test' && params.fnName) {
        const testFn = tests[params.fnName];
        if (!!testFn) {
          validator = validator[type](
            testFn.message,
            testFn.message,
            testFn.fn
          );
        }
        return;
      }
      validator = validator[type](params);
    });

    if (!isObject) {
      return schema.concat(yup.object().shape({ [name]: validator }));
    }

    const reversePath = name.split('.').reverse();
    const currNestedObject = reversePath.slice(1).reduce(
      (yupObj, path) => {
        if (!isNaN(path)) {
          return { array: yup.array().of(yup.object().shape(yupObj)) };
        }
        if (yupObj.array) {
          return { [path]: yupObj.array };
        }
        return { [path]: yup.object().shape(yupObj) };
      },
      { [reversePath[0]]: validator }
    );

    const newSchema = yup.object().shape(currNestedObject);
    return schema.concat(newSchema);
  }, yup.object().shape({}));

  return schema;
};

export default getValidationSchema;
