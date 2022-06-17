/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:53
 * @LastEditTime: 2022-06-17 16:01:13
 * @LastEditors: lmk
 * @Description: AirdropSuccess test
 */

import React from 'react';
import {shallow } from 'enzyme';
import AirdropResult from '.';
describe('GreatePosts', () => {
  it('should render correctly', () => {
    const component = shallow(< AirdropResult/>)
    expect(component).toMatchSnapshot();
  });
});