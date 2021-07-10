import React from 'react';
import Home from './';
import {shallow } from 'enzyme';
describe('Home', () => {
  it('should render correctly', () => {
    const component = shallow(<Home></Home>)
    expect(component).toMatchSnapshot();
  });
});