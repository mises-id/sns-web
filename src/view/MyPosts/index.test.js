/*
 * @Author: lmk
 * @Date: 2021-07-16 00:14:28
 * @LastEditTime: 2021-07-16 00:14:43
 * @LastEditors: lmk
 * @Description: MyPost test
 */

import React from 'react';
import MyPost from './';
import {shallow } from 'enzyme';
describe('MyPost', () => {
  it('should render correctly', () => {
    const component = shallow(<MyPost />)
    expect(component).toMatchSnapshot();
  });
});