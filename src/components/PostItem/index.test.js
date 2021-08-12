/*
 * @Author: lmk
 * @Date: 2021-07-15 10:46:27
 * @LastEditTime: 2021-07-15 10:47:10
 * @LastEditors: lmk
 * @Description: CreateMisesIdtest
 */
import React from 'react';
import {shallow } from 'enzyme';
import PostItem from './';
describe('CreateMisesId', () => {
  it('should render correctly', () => {
    const component = shallow(<PostItem />)
    expect(component).toMatchSnapshot();
  });
});