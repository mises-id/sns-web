/*
 * @Author: lmk
 * @Date: 2021-07-16 00:14:28
 * @LastEditTime: 2021-12-31 09:57:00
 * @LastEditors: lmk
 * @Description: MyPost test
 */

import React from 'react';
import Notifications from './';
import {shallow } from 'enzyme';
describe('Notifications', () => {
  it('should render correctly', () => {
    const component = shallow(<Notifications />)
    expect(component).toMatchSnapshot();
  });
});