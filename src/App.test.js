import React from 'react';
import App from './App';
import { shallow,configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
configure({ adapter: new Adapter() });
describe('App', () => {
  it('should render correctly', () => {
    const component = shallow(
      <App></App>,
    )
    expect(component).toMatchSnapshot();
  });
});