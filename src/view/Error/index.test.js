/*
 * @Author: lmk
 * @Date: 2021-07-16 00:14:28
 * @LastEditTime: 2021-07-16 00:14:43
 * @LastEditors: lmk
 * @Description: MyLikes test
 */

import React from 'react';
import Error from '.';
import {shallow } from 'enzyme';
describe('Error', () => {
  it('should render correctly', () => {
    const component = shallow(<Error />)
    expect(component).toMatchSnapshot();
  });
});