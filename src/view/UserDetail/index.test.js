/*
 * @Author: lmk
 * @Date: 2021-07-15 15:48:10
 * @LastEditTime: 2022-01-05 10:30:32
 * @LastEditors: lmk
 * @Description: UserDetail test
 */

import React from 'react';
import UserDetail from './';
import {shallow } from 'enzyme';
describe('UserDetail', () => {
  it('should render correctly', () => {
    const component = shallow(<UserDetail />)
    expect(component).toMatchSnapshot();
  });
});