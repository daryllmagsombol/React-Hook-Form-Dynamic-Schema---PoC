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

const validateField = (_validator, _validation, _field) => {
  const { params, type } = _validation;
  if (!_validator[type]) {
    return;
  }

  if (type === 'required') {
    switch (_field.type) {
      case 'text':
        _validator = _validator[type](InputDefaultRequiredTemplate);
        break;
      case 'select':
        _validator = _validator[type](selectDefaultRequiredTemplate);
        break;
      case 'date':
        _validator = _validator[type](dateDefaultRequiredTemplate);
        break;
      default:
        _validator = _validator[type]();
    }
  } else if (type === 'test') {
    if (params?.fnName) {
      const customFn = tests[params.fnName];
      if (!!customFn) {
        _validator = _validator[type](
          customFn.message,
          customFn.message,
          customFn.fn
        );
      }
    } else if (params.type === 'custom') {
      try {
        const customFn = new Function(params.args, params.body);
        _validator = _validator[type](params.name, params.message, customFn);
        return;
      } catch (e) {
        console.log('Error decoding function body.');
        return;
      }
    }
  } else {
    _validator = _validator[type](params);
  }

  _validator = _validator.typeError(_field?.validationTypeError || '');
  return _validator;
};

const getValidationSchema = (fields) => {
  const schema = fields.reduce((schema, field) => {
    const {
      name,
      label,
      validationType,
      validations = [],
      arrayFields = [],
    } = field;
    const isObject = name.indexOf('.') >= 0;

    if (!yup[validationType]) {
      return schema;
    }

    let validator = yup[validationType]();
    if (label) validator = validator.label(label);

    validations.forEach((v) => {
      validator = validateField(validator, v, field);
    });

    // for array fields validations
    if (validationType === 'array' && arrayFields.length) {
      let fieldSchema = {};
      arrayFields.map((o) => {
        let _validator = yup[o.validationType]();
        if (o.label) _validator = _validator.label(o.label);

        o.validations.forEach((v) => {
          _validator = validateField(_validator, v, o);
        });
        fieldSchema = { ...fieldSchema, [o.name]: _validator };
        return _validator;
      });

      if (fieldSchema)
        validator = validator.of(yup.object().shape(fieldSchema));
    }

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
