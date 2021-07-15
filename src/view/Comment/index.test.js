/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:05
 * @LastEditTime: 2021-07-15 16:07:36
 * @LastEditors: lmk
 * @Description: Comment test
 */

import React from 'react';
import {shallow } from 'enzyme';
import Comment from './';
describe('Comment', () => {
  it('should render correctly', () => {
    const component = shallow(<Comment />)
    expect(component).toMatchSnapshot();
  });
});