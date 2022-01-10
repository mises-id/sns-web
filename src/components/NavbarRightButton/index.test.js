/*
 * @Author: lmk
 * @Date: 2021-07-15 10:46:27
 * @LastEditTime: 2021-08-13 00:12:35
 * @LastEditors: lmk
 * @Description: CreateMisesIdtest
 */
import React from 'react';
import {shallow } from 'enzyme';
import Navbar from './';
describe('CreateMisesId', () => {
  it('should render correctly', () => {
    const component = shallow(<Navbar />)
    expect(component).toMatchSnapshot();
  });
});