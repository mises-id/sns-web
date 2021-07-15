/*
 * @Author: lmk
 * @Date: 2021-07-15 15:48:10
 * @LastEditTime: 2021-07-15 15:48:41
 * @LastEditors: lmk
 * @Description: posts test
 */

import React from 'react';
import Post from './';
import {shallow } from 'enzyme';
describe('Post', () => {
  it('should render correctly', () => {
    const component = shallow(<Post />)
    expect(component).toMatchSnapshot();
  });
});