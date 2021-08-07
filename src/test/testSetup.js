/*
 * @Author: lmk
 * @Date: 2021-07-10 16:02:30
 * @LastEditTime: 2021-07-23 14:05:49
 * @LastEditors: lmk
 * @Description: 
 */

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: key => key})
}));
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue({
   loginForm:{}
  }),
  useDispatch:jest.fn()
}));
