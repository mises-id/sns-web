
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));