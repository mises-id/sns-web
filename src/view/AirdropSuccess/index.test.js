/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:53
 * @LastEditTime: 2022-03-03 16:30:29
 * @LastEditors: lmk
 * @Description: AirdropSuccess test
 */

import React from 'react';
import {shallow } from 'enzyme';
import AirdropSuccess from '.';
describe('GreatePosts', () => {
  it('should render correctly', () => {
    const component = shallow(< AirdropSuccess/>)
    expect(component).toMatchSnapshot();
  });
});