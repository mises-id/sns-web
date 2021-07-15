import React from 'react';
import Me from './';
import {shallow } from 'enzyme';
describe('Me', () => {
  it('should render correctly', () => {
    const component = shallow(<Me />)
    expect(component).toMatchSnapshot();
  });
});