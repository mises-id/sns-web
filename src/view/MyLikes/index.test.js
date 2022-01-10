/*
 * @Author: lmk
 * @Date: 2021-07-16 00:14:28
 * @LastEditTime: 2021-07-16 00:14:43
 * @LastEditors: lmk
 * @Description: MyLikes test
 */

import React from 'react';
import MyLikes from '.';
import {shallow } from 'enzyme';
describe('MyLikes', () => {
  it('should render correctly', () => {
    const component = shallow(<MyLikes />)
    expect(component).toMatchSnapshot();
  });
});