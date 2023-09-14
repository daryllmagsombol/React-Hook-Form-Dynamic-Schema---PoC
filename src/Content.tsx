import PersonalInfoForm from './PersonalInfoForm';
import HobbiesAndInterestsForm from './HobbiesAndInterestsForm';
import FavoriteThingsForm from './FavoriteThingsForm';

const Content = ({ activeTab }) => {
  const getContent = () => {
    switch (activeTab) {
      case 'Personal Information':
        return <PersonalInfoForm />
      case 'Hobbies and Interests':
        return <HobbiesAndInterestsForm></HobbiesAndInterestsForm>;
      case 'Favorite Things':
        return <FavoriteThingsForm></FavoriteThingsForm>;
      default:
        return null;
    }
  };

  return <div className='tab-content'>{getContent()}</div>;
};

export default Content;
