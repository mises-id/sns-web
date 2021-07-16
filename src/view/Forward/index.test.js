/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:50
 * @LastEditTime: 2021-07-16 10:06:23
 * @LastEditors: lmk
 * @Description: Forward test
 */

import React from 'react';
import {shallow } from 'enzyme';
import Forward from './';
describe('Forward', () => {
  it('should render correctly', () => {
    const component = shallow(<Forward />)
    expect(component).toMatchSnapshot();
  });
});