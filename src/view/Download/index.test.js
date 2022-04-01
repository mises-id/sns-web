/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:53
 * @LastEditTime: 2022-03-31 09:49:39
 * @LastEditors: lmk
 * @Description: Download test
 */

import React from 'react';
import {shallow } from 'enzyme';
import Download from '.';
describe('GreatePosts', () => {
  it('should render correctly', () => {
    const component = shallow(< Download/>)
    expect(component).toMatchSnapshot();
  });
});