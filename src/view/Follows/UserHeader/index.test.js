/*
 * @Author: lmk
 * @LastEditors: lmk
 * @Description: userHeaderTest
 */

import React from 'react';
import {shallow } from 'enzyme';
import UserHeader from './';
describe('UserHeader', () => {
  it('should render correctly', () => {
    const component = shallow(<UserHeader />)
    expect(component).toMatchSnapshot();
  });
});