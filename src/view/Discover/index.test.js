import React from 'react';
import {shallow } from 'enzyme';
import Discover from './';
describe('Discover', () => {
  it('should render correctly', () => {
    const component = shallow(<Discover />)
    expect(component).toMatchSnapshot();
  });
});