import { useState } from 'react';
import './style.css';
import PersonalInfoForm from './PersonalInfoForm';
import HobbiesAndInterestsForm from './HobbiesAndInterestsForm';
import FavoriteThingsForm from './FavoriteThingsForm';
import Swal from 'sweetalert2';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import personalInformationSchema from './schema/personalInformation';
import getValidationSchema from './schema/common';
const { data: personalInfoFields } = require('./schema/payload.json');

const emptyEmployeeForm = {
  status: 'new',
  birthday: '',
  address: '',
  employeeId: '',
  firstName: '',
  lastName: '',
  maritalStatus: '',
  middleName: '',
  gender: '',
};

const initialEmployeeList = [
  {
    status: 'submitted',
    birthday: '1900-01-09',
    address: 'bikiniBottom',
    employeeId: 2345678,
    firstName: 'Squidward',
    lastName: 'Tentacles',
    maritalStatus: 'single',
    gender: 'male',
  },
  {
    status: 'submitted',
    birthday: '1993-06-09',
    address: 'bikiniBottom',
    employeeId: 5454123,
    firstName: 'Eugene',
    lastName: 'Krabs',
    maritalStatus: 'married',
    gender: 'male',
  },
  {
    status: 'submitted',
    birthday: '1993-06-09',
    address: 'bikiniBottom',
    employeeId: 1234567,
    firstName: 'Spongebob',
    lastName: 'Squarepants',
    maritalStatus: 'single',
    gender: 'male',
  },
  {
    status: 'draft',
    employeeId: 9876543,
    firstName: 'Walter',
    lastName: 'White',
    maritalStatus: '',
    gender: '',
    address: '',
    birthday: '',
  },
].reduce((acc, employee) => {
  acc[employee.employeeId] = employee;
  return acc;
}, {}); // Normalize into [employeeID]:{...employeeObject}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);
  const [employeeList, setEmployeeList] = useState(initialEmployeeList);
  const [formMode, setFormMode] = useState('add');

  const submittedList = Object.keys(employeeList)
    .map((id) => employeeList[id])
    .filter((emp) => emp.status == 'submitted');
  const draftList = Object.keys(employeeList)
    .map((id) => employeeList[id])
    .filter((emp) => emp.status == 'draft');

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleClickEmployeeItem = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setFormMode('view');
  };

  const handleClickAddEmployeeButton = () => {
    setFormMode('add');
    setSelectedEmployeeId(0);
    personalInfoFormMethods.reset(emptyEmployeeForm);
  };

  const handleClickEdit = () => {
    setFormMode('edit');
  };

  const handleClickCancelEdit = () => {
    setFormMode('view');
    personalInfoFormMethods.reset(employeeList[selectedEmployeeId]);
  };

  const handlePersonalInfoSubmitAdd = (employee) => {
    employee.status = 'submitted';
    setEmployeeList({ ...employeeList, [employee.employeeId]: employee });
    setSelectedEmployeeId(employee.employeeId);
    setFormMode('view');
    Swal.fire('Employee successfully added!', '', 'success');
  };

  const handlePersonalInfoSubmitEdit = async () => {
    const fieldsToValidate = Object.keys(emptyEmployeeForm).filter(
      (field) => field != 'employeeId'
    );
    // Trigger validation for the specific fields only
    const validationResults = await Promise.all(
      fieldsToValidate.map((fieldName) => trigger(fieldName))
    );

    const hasErrors = validationResults.some((result) => result === false);

    if (!hasErrors) {
      const employee = getValues();
      employee.status = 'submitted';
      setEmployeeList({ ...employeeList, [employee.employeeId]: employee });
      setSelectedEmployeeId(employee.employeeId);
      setFormMode('view');
      Swal.fire('Employee successfully updated!', '', 'success');
    }
  };

  // custom draft minimum fields validation
  const handlePersonalInfoSubmitDraft = async () => {
    clearErrors(); // Clear errors in unneeded fields
    const fieldsToValidate = [
      // submitting drafts only require these fields
      'employeeId',
      'firstName',
      'lastName',
    ];

    // Trigger validation for the specific fields only
    const validationResults = await Promise.all(
      fieldsToValidate.map((fieldName) => trigger(fieldName))
    );

    const hasErrors = validationResults.some((result) => result === false);

    if (!hasErrors) {
      const employeeForm = getValues();
      employeeForm.status = 'draft';
      setEmployeeList({
        ...employeeList,
        [employeeForm.employeeId]: employeeForm,
      });
      setSelectedEmployeeId(employeeForm.employeeId);
      setFormMode('view');
      Swal.fire('Employee successfully saved as draft!', '', 'success');
    } else {
      console.log('Form is not valid. Cannot save as draft.');
    }
  };

  const checkEmployeeIdUniqueness = (employeeId) => {
    let existingListBasis = [];
    const employeeFormStatus = getValues().status;
    if (employeeFormStatus == 'submitted' || employeeFormStatus == 'new') {
      existingListBasis = [...submittedList, ...draftList];
    } else if (employeeFormStatus == 'draft') {
      existingListBasis = [...submittedList];
    }
    return !existingListBasis.some(
      (existingEmployee) => existingEmployee.employeeId == employeeId
    );
  };

  const personalInfoFormMethods = useForm({
    resolver: yupResolver(getValidationSchema(personalInfoFields)),
    mode: 'onTouched',
    values: employeeList[selectedEmployeeId],
    context: { checkEmployeeIdUniqueness },
  });

  const { handleSubmit, clearErrors, trigger, getValues } =
    personalInfoFormMethods;

  const getFormHeader = (): any => {
    if (formMode == 'add') {
      return 'Add New Employee';
    } else if (formMode == 'view') {
      return 'View Employee';
    } else if (formMode == 'edit') {
      return 'Edit Employee';
    }
  };

  return (
    <div className='app'>
      <div className='sidebar'>
        <div className='logo-container'>
          <img
            className='logo'
            src='https://eatatthekrustykrab.files.wordpress.com/2018/04/logo.png'
          />
        </div>

        <h3>Employees</h3>
        <ul>
          {submittedList.map((emp) => {
            return (
              <li
                className={selectedEmployeeId == emp.employeeId ? 'active' : ''}
                onClick={() => {
                  handleClickEmployeeItem(emp.employeeId);
                }}
              >
                {emp.firstName} {emp.middleName} {emp.lastName}
              </li>
            );
          })}
        </ul>

        <h3>Drafts</h3>
        <ul>
          {draftList.map((draft) => {
            return (
              <li
                className={
                  selectedEmployeeId == draft.employeeId ? 'active' : ''
                }
                onClick={() => {
                  handleClickEmployeeItem(draft.employeeId);
                }}
              >
                {draft.firstName} {draft.middleName} {draft.lastName}
              </li>
            );
          })}
        </ul>

        <div className='buttons-container'>
          <button
            className='add-employee'
            onClick={handleClickAddEmployeeButton}
          >
            Add an Employee
          </button>
        </div>
      </div>
      <div className='tabs-and-content-container'>
        <div className='tabs-container'>
          <div
            className={`tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabClick(0)}
          >
            Tab 1
          </div>
          <div
            className={`tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabClick(1)}
          >
            Tab 2
          </div>
          <div
            className={`tab ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabClick(2)}
          >
            Tab 3
          </div>
        </div>

        <div className='content'>
          {activeTab === 0 && (
            <div>
              <FormProvider {...personalInfoFormMethods}>
                <PersonalInfoForm
                  formHeader={getFormHeader()}
                  shouldDisableAllFields={formMode == 'view'}
                  shouldDisableEmployeeId={
                    employeeList[selectedEmployeeId] &&
                    employeeList[selectedEmployeeId]?.status != 'new'
                  }
                ></PersonalInfoForm>
              </FormProvider>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <HobbiesAndInterestsForm></HobbiesAndInterestsForm>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <FavoriteThingsForm></FavoriteThingsForm>
            </div>
          )}
        </div>

        {formMode != 'view' && (
          <div className='buttons-container'>
            {formMode == 'add' && (
              <button
                type='submit'
                onClick={handleSubmit(handlePersonalInfoSubmitAdd)}
              >
                Submit
              </button>
            )}
            {formMode == 'edit' && (
              <button type='submit' onClick={handlePersonalInfoSubmitEdit}>
                Submit
              </button>
            )}
            {employeeList[selectedEmployeeId]?.status != 'submitted' && (
              <button type='submit' onClick={handlePersonalInfoSubmitDraft}>
                Save as Draft
              </button>
            )}
            {employeeList[selectedEmployeeId] &&
              employeeList[selectedEmployeeId]?.status != 'new' && (
                <button onClick={handleClickCancelEdit}>Cancel Editing</button>
              )}
          </div>
        )}
        {formMode == 'view' && (
          <div className='buttons-container'>
            <button onClick={handleClickEdit}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}
