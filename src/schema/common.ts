import * as yup from 'yup';
import { tests } from './schema-tests';

export const InputDefaultRequiredTemplate = ({ label }): string =>
  `Input ${label}`;
export const selectDefaultRequiredTemplate = ({ label }): string =>
  `Select ${label}`;
export const dateDefaultRequiredTemplate = ({ label }): string =>
  `Input date ${label}`;
export const defaultInvalidCharacter = ({ label }): string =>
  `Invalid Character(s) in ${label}`;
export const defaultCheckboxRequired = ({ label }): string =>
  `Please select ${label}.`;

const getValidationSchema = (fields) => {
  const schema = fields.reduce((schema, field) => {
    const {
      name,
      label,
      type: fieldType,
      validationType,
      validationTypeError,
      validations = [],
    } = field;
    const isObject = name.indexOf('.') >= 0;

    if (!yup[validationType]) {
      return schema;
    }
    let validator = yup[validationType]();
    if (label) validator = validator.label(label);

    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) {
        return;
      }

      if (type === 'required') {
        switch (fieldType) {
          case 'text':
            validator = validator[type](InputDefaultRequiredTemplate);
            break;
          case 'select':
            validator = validator[type](selectDefaultRequiredTemplate);
            break;
          case 'date':
            validator = validator[type](dateDefaultRequiredTemplate);
            break;
          default:
            validator = validator[type]();
        }
      } else if (type === 'test') {
        if (params?.fnName) {
          const customFn = tests[params.fnName];
          if (!!customFn) {
            validator = validator[type](
              customFn.message,
              customFn.message,
              customFn.fn
            );
          }
        } else if (params.type === 'custom') {
          try {
            const customFn = new Function(params.args, params.body);
            validator = validator[type](params.name, params.message, customFn);
            return;
          } catch (e) {
            console.log('Error decoding function body.');
            return;
          }
        }
      } else {
        validator = validator[type](params);
      }

      validator = validator.typeError(validationTypeError || '');
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
