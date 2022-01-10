
import React from 'react';
import BlackList from '.';
import {shallow } from 'enzyme';
describe('BlackList', () => {
  it('should render correctly', () => {
    const component = shallow(<BlackList />)
    expect(component).toMatchSnapshot();
  });
});