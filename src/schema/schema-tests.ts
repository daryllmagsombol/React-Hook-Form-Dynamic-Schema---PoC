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
