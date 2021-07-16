/*
 * @Author: lmk
 * @Date: 2021-07-16 10:05:53
 * @LastEditTime: 2021-07-16 10:06:40
 * @LastEditors: lmk
 * @Description: GreatePosts test
 */

import React from 'react';
import {shallow } from 'enzyme';
import GreatePosts from './';
describe('GreatePosts', () => {
  it('should render correctly', () => {
    const component = shallow(<GreatePosts />)
    expect(component).toMatchSnapshot();
  });
});