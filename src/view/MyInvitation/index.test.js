/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:53
 * @LastEditTime: 2022-06-29 10:06:08
 * @LastEditors: lmk
 * @Description: Airdrop test
 */

import React from 'react';
import {shallow } from 'enzyme';
import MyInvitation from './';
describe('MyInvitation', () => {
  it('should render correctly', () => {
    const component = shallow(<MyInvitation />)
    expect(component).toMatchSnapshot();
  });
});