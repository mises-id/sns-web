import React from 'react';
import {shallow } from 'enzyme';
import Found from './';
describe('Found', () => {
  it('should render correctly', () => {
    const component = shallow(<Found></Found>)
    expect(component).toMatchSnapshot();
  });
});