/*
 * @Author: lmk
 * @Date: 2021-07-15 16:07:05
 * @LastEditTime: 2022-03-08 09:38:01
 * @LastEditors: lmk
 * @Description: Following test
 */
import React from 'react';
import Following from './';
import {shallow } from 'enzyme';
describe('Following', () => {
  it('should render correctly', () => {
    const component = shallow(<Following />)
    expect(component).toMatchSnapshot();
  });
});