

import React from 'react';
import {shallow } from 'enzyme';
import Link from './';
describe('Link', () => {
  it('should render correctly', () => {
    const component = shallow(<Link />)
    expect(component).toMatchSnapshot();
  });
});