/*
 * @Author: lmk
 * @Date: 2021-07-15 00:25:14
 * @LastEditTime: 2021-07-15 16:34:27
 * @LastEditors: lmk
 * @Description: Follows test
 */
import React from 'react';
import {shallow } from 'enzyme';
import Follows from './';
describe('Follows', () => {
  it('should render correctly', () => {
    const component = shallow(<Follows />)
    expect(component).toMatchSnapshot();
  });
});