import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().strict(),
  lastName: yup.string().required('Last name is required'),
  birthday: yup.date().required('Birthday is required'),
  maritalStatus: yup
    .string()
    .oneOf(['single', 'married', 'widowed'])
    .required('Marital status is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'na'])
    .required('Gender is required'),
  address: yup
    .string()
    .oneOf(['bikiniBottom', 'jellyfishFields', 'newKelpCity', 'rockBottom'])
    .required('Address is required'),
  employeeId: yup
    .number()
    .required('Employee ID is required')
    .typeError('Employee ID must be a number')
    .test('unique', 'Employee ID must be unique', async function (value) {
      // Validates thru API call
      if (!value) return true; // Skip the test if the field is empty
      const { checkEmployeeIdUniqueness } = this.options.context;
      return checkEmployeeIdUniqueness(value); // Call the validation function and return the result
    })
    .test(
      'len',
      'Employee ID must be exactly 7 characters',
      (val) => val && val.toString().length === 7
    ),
  status: yup.string().oneOf(['submitted', 'draft']),
});

export default schema;
