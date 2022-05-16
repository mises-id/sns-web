/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:10
 * @LastEditTime: 2022-05-10 14:24:40
 * @LastEditors: lmk
 * @Description: NFTDetail
 */
import React from 'react';
import NFTDetail from '.';
import {shallow } from 'enzyme';
describe('NFTDetail', () => {
  it('should render correctly', () => {
    const component = shallow(<NFTDetail />)
    expect(component).toMatchSnapshot();
  });
});