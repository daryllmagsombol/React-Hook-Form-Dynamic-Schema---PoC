import { useFormContext, Controller } from 'react-hook-form';

const PersonalInfoForm = ({
  formHeader,
  shouldDisableEmployeeId,
  shouldDisableAllFields,
}: any) => {
  const { control } = useFormContext();

  return (
    <form className='personal-info-form'>
      <div>
        <h3>{formHeader}</h3>
      </div>
      <div>
        <label>First Name</label>
        <Controller
          control={control}
          name='firstName'
          render={({ field, fieldState: { error } }) => (
            <div>
              <input {...field} disabled={shouldDisableAllFields} />
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Last Name</label>
        <Controller
          control={control}
          name='lastName'
          render={({ field, fieldState: { error } }) => (
            <div>
              <input {...field} disabled={shouldDisableAllFields} />
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Birthday</label>
        <Controller
          control={control}
          name='birthday'
          render={({ field, fieldState: { error } }) => (
            <div>
              <input type='date' {...field} disabled={shouldDisableAllFields} />
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Gender</label>
        <Controller
          control={control}
          name='gender'
          render={({ field, fieldState: { error } }) => (
            <div>
              <select {...field} disabled={shouldDisableAllFields}>
                <option value=''>Select</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='na'>N/A</option>
              </select>
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Marital Status</label>
        <Controller
          control={control}
          name='maritalStatus'
          render={({ field, fieldState: { error } }) => (
            <div>
              <select {...field} disabled={shouldDisableAllFields}>
                <option value=''>Select</option>
                <option value='single'>Single</option>
                <option value='married'>Married</option>
                <option value='widowed'>Widowed</option>
              </select>
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Address</label>
        <Controller
          control={control}
          name='address'
          render={({ field, fieldState: { error } }) => (
            <div>
              <select {...field} disabled={shouldDisableAllFields}>
                <option value=''>Select</option>
                <option value='bikiniBottom'>Bikini Bottom</option>
                <option value='jellyfishFields'>Jellyfish Fields</option>
                <option value='newKelpCity'>New Kelp City</option>
                <option value='rockBottom'>Rock Bottom</option>
              </select>
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Employee ID</label>
        <Controller
          control={control}
          name='employeeId'
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                {...field}
                disabled={shouldDisableEmployeeId || shouldDisableAllFields}
              />
              {error && <p className='form-errors'>{error.message}</p>}
            </div>
          )}
        />
      </div>
      <div>
        <label>Form Status</label>
        <Controller
          control={control}
          name='status'
          render={({ field }) => (
            <div>
              <select {...field} disabled={true}>
                <option value='new'>New</option>
                <option value='draft'>Draft</option>
                <option value='submitted'>Submitted</option>
              </select>
            </div>
          )}
        />
      </div>
      <div>
        <h3>Addresses</h3>
      </div>
      <div>
        <label>Street 1</label>
        <Controller
          control={control}
          name={'addresses.0.street'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <label>City 1</label>
        <Controller
          control={control}
          name={'addresses.0.city'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <label>Barangay 1</label>
        <Controller
          control={control}
          name={'addresses.0.barangay'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <label>Street 2</label>
        <Controller
          control={control}
          name={'addresses.1.street'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <label>City 2</label>
        <Controller
          control={control}
          name={'addresses.1.city'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
      <div>
        <label>Barangay 2</label>
        <Controller
          control={control}
          name={'addresses.1.barangay'}
          render={({ field, fieldState: { error } }) => {
            return (
              <div>
                <input {...field} disabled={shouldDisableAllFields} />
                {error && <p className='form-errors'>{error.message}</p>}
              </div>
            );
          }}
        />
      </div>
    </form>
  );
};

export default PersonalInfoForm;
