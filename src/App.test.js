import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
describe('App', () => {
  it('should render correctly', () => {
    const component = shallow(<App></App>)
    expect(component).toMatchSnapshot();
  });
});