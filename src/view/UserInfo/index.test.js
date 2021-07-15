/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:10
 * @LastEditTime: 2021-07-15 12:51:20
 * @LastEditors: lmk
 * @Description: UserInfotest
 */
import React from 'react';
import UserInfo from './';
import {shallow } from 'enzyme';
describe('UserInfo', () => {
  it('should render correctly', () => {
    const component = shallow(<UserInfo />)
    expect(component).toMatchSnapshot();
  });
});