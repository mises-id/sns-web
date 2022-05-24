/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:10
 * @LastEditTime: 2021-07-15 12:51:20
 * @LastEditors: lmk
 * @Description: UserInfotest
 */
import React from 'react';
import NFTPage from './';
import {shallow } from 'enzyme';
describe('NFTPage', () => {
  it('should render correctly', () => {
    const component = shallow(<NFTPage />)
    expect(component).toMatchSnapshot();
  });
});