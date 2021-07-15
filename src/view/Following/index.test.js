
import React from 'react';
import Following from './';
import {shallow } from 'enzyme';
describe('Following', () => {
  it('should render correctly', () => {
    const component = shallow(<Following />)
    expect(component).toMatchSnapshot();
  });
});